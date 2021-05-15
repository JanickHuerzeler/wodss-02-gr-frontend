import React from "react";
import { render, fireEvent, waitForElement, getByTestId } from "@testing-library/react";
import SearchBar from "../components/SearchBar";
import {SearchBoxProps} from "../types/SearchBar";

function renderSearchBar(props: Partial<SearchBoxProps> = {}) {
  const defaultProps: SearchBoxProps = {
    onLocationChanged(lat: number | null, lng: number | null): void {
      return;
    },
    placeholder: "Von",
    focus: true,
    tabIndex: 0
  };
  return render(<SearchBar {...defaultProps} {...props} />);
}

describe("<SearchBar />", () => {
  test("<SearchBar/> rendering", async () => {
    const { findByTestId } = renderSearchBar();

    const searchbarinput = await findByTestId("searchbarinput");

    expect(searchbarinput.getAttribute("placeholder")).toBe("Von");
  });

  test("should return Aarau coords", async () => {
    const onLocationChanged = jest.fn((lat: number | null, lng: number | null)=>{});
    const { findByTestId } = renderSearchBar({ onLocationChanged });
    const searchbarinput = await findByTestId("searchbarinput");
    
    expect(searchbarinput).toBeInTheDocument();

    fireEvent.change(searchbarinput, { target: { value: "Aarau, Schweiz" } });
  
    expect(onLocationChanged).toHaveBeenCalledWith({lat: 47.390434, lng: 8.0457015});
  });

  // // https://www.pluralsight.com/guides/simulate-browser-events-react-react-testing-library
  // xit("captures changes", done => {
  //   function handleChange(evt: any) {
  //     expect(evt.target.value).toEqual("whamo");
  //     done();
  //   }
  //   const { getByTestId } = render(
  //     <SearchBar onLocationChanged={handleChange} placeholder={"Von"}></SearchBar>
  //   );
  //   const node = getByTestId("Change Me");
  //   fireEvent.change(node, { target: { value: "whamo" } });
  // });
});
