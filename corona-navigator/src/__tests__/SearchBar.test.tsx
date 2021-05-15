import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import SearchBar from "../components/SearchBar";

let container: Element | DocumentFragment | null;
const handleLocationChangedMock = jest.fn(
  (lat: number | null, lng: number | null) => {}
);

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) {
    document.body.removeChild(container);
    container = null;
  }
});

xit("can render and update a counter", () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(
      <SearchBar
        onLocationChanged={handleLocationChangedMock}
        placeholder={"Von"}
      ></SearchBar>,
      container
    );
  });
  const input = container!.querySelector("input");
  expect(input!.placeholder).toBe("Von");
  // Test second render and componentDidUpdate
  act(() => {
    input!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    input!.value = "Aarau, Schweiz";
    input!.dispatchEvent(new Event('change'));
  });

  expect(input!.value).toBe("Aarau, Schweiz");
  expect(handleLocationChangedMock).toBeCalled();
  expect(handleLocationChangedMock).toBeCalledWith({lat: 47.390434, lng: 8.0457015});
//   expect(label!.textContent).toBe("You clicked 1 times");
//   expect(document.title).toBe("You clicked 1 times");
});
