import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

test("renders the FarmerDetect login screen", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: "Farmer Detect", level: 1 })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login to farmerdetect/i }))
    .toBeInTheDocument();
});

test("shows an error when login is attempted without a saved profile", async () => {
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText("example@gmail.com"), {
    target: { value: "farmer@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
    target: { value: "Password1" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login to farmerdetect/i }));

  await waitFor(() => {
    expect(screen.getByText(/no account found/i)).toBeInTheDocument();
  });
});
