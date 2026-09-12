import os
import cv2
import numpy as np
import tensorflow as tf

from datasets import load_dataset
from sklearn.model_selection import train_test_split

from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ============================================================
# CROP AI - PLANT DISEASE DETECTION
# Python 3.12 + TensorFlow 2.21
# ============================================================

IMG_SIZE = 160
BATCH_SIZE = 16
EPOCHS = 3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.getenv(
    "PLANTVILLAGE_DIR",
    os.path.join(BASE_DIR, "data", "PlantVillage"),
)
MODEL_FILE = os.path.join(BASE_DIR, "model", "crop_health_model.keras")

# Maximum images used from each class
IMAGES_PER_CLASS = 100


print("=" * 50)
print("🌱 CROP AI - PLANT HEALTH DETECTOR")
print("=" * 50)

print("\nTensorFlow version:", tf.__version__)
print("Num GPUs available:", len(tf.config.list_physical_devices("GPU")))


# ============================================================
# 1. LOAD PLANTVILLAGE DATASET
# ============================================================

print("\n" + "=" * 50)
print("🌱 DOWNLOADING / LOADING PLANTVILLAGE")
print("=" * 50)

if not os.path.isdir(DATASET_DIR):
    raise FileNotFoundError(
        "PlantVillage dataset folder was not found. "
        f"Place class folders inside: {DATASET_DIR}"
    )

image_extensions = (".jpg", ".jpeg", ".png", ".webp")
has_images = any(
    file_name.lower().endswith(image_extensions)
    for root, _, files in os.walk(DATASET_DIR)
    for file_name in files
)
if not has_images:
    raise FileNotFoundError(
        "PlantVillage dataset folder is empty. Add image files inside "
        f"class folders under: {DATASET_DIR}"
    )

dataset = load_dataset("imagefolder", data_dir=DATASET_DIR)

print("\n✅ Dataset loaded!")
print(dataset)

print("\nAvailable columns:")
print(dataset["train"].column_names)


# ============================================================
# 2. FIND IMAGE AND LABEL COLUMNS AUTOMATICALLY
# ============================================================

train_data = dataset["train"]

features = train_data.features

print("\nDataset features:")
print(features)


# Find image column
image_column = None

for column_name, feature in features.items():
    if feature.__class__.__name__.lower() == "image":
        image_column = column_name
        break

if image_column is None:
    # Common fallback
    for candidate in ["image", "img", "images"]:
        if candidate in train_data.column_names:
            image_column = candidate
            break

if image_column is None:
    raise ValueError(
        "❌ Could not find an image column in the dataset."
    )


print("\n🖼️ Image column:", image_column)


# ============================================================
# 3. FIND LABEL / CLASS INFORMATION
# ============================================================

label_column = None

for column_name, feature in features.items():

    feature_name = feature.__class__.__name__.lower()

    if feature_name == "classlabel":
        label_column = column_name
        break


if label_column is not None:

    print("🏷️ Label column:", label_column)

    label_feature = features[label_column]

    label_names = label_feature.names

    print("\nTotal classes:", len(label_names))

    for i, name in enumerate(label_names):
        print(i, "->", name)


else:

    print("\n⚠️ No ClassLabel column found.")

    # Try to find a string-based label column
    for column_name, feature in features.items():

        if column_name == image_column:
            continue

        if feature.__class__.__name__.lower() == "string":
            label_column = column_name
            break


    if label_column is None:

        raise ValueError(
            "❌ Could not find a label/class column."
        )

    print("🏷️ Using label column:", label_column)


# ============================================================
# 4. SELECT DATA
# ============================================================

print("\n" + "=" * 50)
print("📦 PREPARING DATA")
print("=" * 50)


images = []
labels = []


# Dictionary for limiting images per class
class_counter = {}


total_records = len(train_data)

print("Total training records:", total_records)


for index in range(total_records):

    row = train_data[index]

    # ----------------------------
    # Get label
    # ----------------------------

    raw_label = row[label_column]

    if label_column in features:

        feature = features[label_column]

        if feature.__class__.__name__.lower() == "classlabel":

            label_id = int(raw_label)

            class_name = label_names[label_id]

        else:

            class_name = str(raw_label)

    else:

        class_name = str(raw_label)


    # ----------------------------
    # Limit images per class
    # ----------------------------

    if class_name not in class_counter:
        class_counter[class_name] = 0

    if class_counter[class_name] >= IMAGES_PER_CLASS:
        continue

    # ----------------------------
    # Get image
    # ----------------------------

    image = row[image_column]

    try:

        # HuggingFace PIL image
        image = np.array(image)

    except Exception:

        continue


    if image is None:
        continue


    # ----------------------------
    # Convert grayscale → RGB
    # ----------------------------

    if len(image.shape) == 2:

        image = cv2.cvtColor(
            image,
            cv2.COLOR_GRAY2RGB
        )

    elif image.shape[-1] == 4:

        image = cv2.cvtColor(
            image,
            cv2.COLOR_RGBA2RGB
        )


    # ----------------------------
    # Resize
    # ----------------------------

    image = cv2.resize(
        image,
        (IMG_SIZE, IMG_SIZE)
    )


    # ----------------------------
    # Convert RGB
    # ----------------------------

    image = image.astype(np.float32)

    image = preprocess_input(image)


    images.append(image)
    labels.append(class_name)

    class_counter[class_name] += 1


    # Progress
    if index % 1000 == 0:

        print(
            f"Processed {index}/{total_records}"
        )


print("\n✅ Data preparation completed!")


# ============================================================
# 5. SHOW CLASS COUNTS
# ============================================================

print("\n" + "=" * 50)
print("📊 CLASS DISTRIBUTION")
print("=" * 50)


unique_classes = sorted(set(labels))

for class_name in unique_classes:

    print(
        f"{class_name}: {labels.count(class_name)} images"
    )


print("\nTotal classes:", len(unique_classes))
print("Total images:", len(images))


# ============================================================
# 6. CONVERT LABELS TO NUMBERS
# ============================================================

class_names = unique_classes

class_to_index = {
    class_name: index
    for index, class_name in enumerate(class_names)
}


numeric_labels = np.array(
    [
        class_to_index[label]
        for label in labels
    ],
    dtype=np.int32
)


X = np.array(images, dtype=np.float32)
y = numeric_labels


print("\nX shape:", X.shape)
print("y shape:", y.shape)


# ============================================================
# 7. TRAIN / VALIDATION SPLIT
# ============================================================

X_train, X_val, y_train, y_val = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining images:", len(X_train))
print("Validation images:", len(X_val))


# ============================================================
# 8. BUILD MOBILE NET V2 MODEL
# ============================================================

print("\n" + "=" * 50)
print("🧠 BUILDING AI MODEL")
print("=" * 50)


base_model = MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    include_top=False,
    weights="imagenet"
)


# Freeze pretrained layers
base_model.trainable = False


model = models.Sequential([
    
    base_model,

    layers.GlobalAveragePooling2D(),

    layers.Dropout(0.30),

    layers.Dense(
        128,
        activation="relu"
    ),

    layers.Dropout(0.20),

    layers.Dense(
        len(class_names),
        activation="softmax"
    )
])


# ============================================================
# 9. COMPILE
# ============================================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.0001
    ),

    loss="sparse_categorical_crossentropy",

    metrics=["accuracy"]
)


print("\n✅ Model created!")

model.summary()


# ============================================================
# 10. TRAIN
# ============================================================

print("\n" + "=" * 50)
print("🚀 TRAINING STARTED")
print("=" * 50)


history = model.fit(
    X_train,
    y_train,

    validation_data=(
        X_val,
        y_val
    ),

    epochs=EPOCHS,

    batch_size=BATCH_SIZE,

    shuffle=True
)


# ============================================================
# 11. EVALUATE
# ============================================================

print("\n" + "=" * 50)
print("📈 MODEL EVALUATION")
print("=" * 50)


loss, accuracy = model.evaluate(
    X_val,
    y_val,
    verbose=1
)


print(
    f"\nValidation Accuracy: {accuracy * 100:.2f}%"
)


# ============================================================
# 12. SAVE MODEL
# ============================================================

model.save(MODEL_FILE)


print("\n" + "=" * 50)
print("💾 MODEL SAVED")
print("=" * 50)

print(
    f"Model file: {os.path.abspath(MODEL_FILE)}"
)


# ============================================================
# 13. SAVE CLASS NAMES
# ============================================================

class_file = os.path.join(BASE_DIR, "model", "class_names.txt")


with open(
    class_file,
    "w",
    encoding="utf-8"
) as file:

    for class_name in class_names:

        file.write(
            class_name + "\n"
        )


print(
    f"Classes saved: {class_file}"
)


# ============================================================
# 14. CAMERA TEST
# ============================================================

print("\n" + "=" * 50)
print("📷 CAMERA MODE")
print("=" * 50)

print("Press Q to quit.")


camera = cv2.VideoCapture(0)


if not camera.isOpened():

    print(
        "❌ Could not open camera."
    )

else:

    while True:

        ret, frame = camera.read()

        if not ret:

            print(
                "❌ Could not read camera."
            )

            break


        # ----------------------------
        # Prepare frame
        # ----------------------------

        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )


        resized = cv2.resize(
            rgb_frame,
            (IMG_SIZE, IMG_SIZE)
        )


        input_image = resized.astype(
            np.float32
        )


        input_image = preprocess_input(
            input_image
        )


        input_image = np.expand_dims(
            input_image,
            axis=0
        )


        # ----------------------------
        # Prediction
        # ----------------------------

        prediction = model.predict(
            input_image,
            verbose=0
        )[0]


        predicted_index = np.argmax(
            prediction
        )


        confidence = prediction[
            predicted_index
        ]


        predicted_class = class_names[
            predicted_index
        ]


        # ----------------------------
        # Display
        # ----------------------------

        text = (
            f"{predicted_class} "
            f"{confidence * 100:.1f}%"
        )


        cv2.putText(
            frame,
            text,
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )


        cv2.imshow(
            "CROP AI - Plant Health Detector",
            frame
        )


        # Q = quit
        if cv2.waitKey(1) & 0xFF == ord("q"):

            break


    camera.release()
    cv2.destroyAllWindows()


print("\n🌱 CROP AI FINISHED.")