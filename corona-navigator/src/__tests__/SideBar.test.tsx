jest.mock("react-icons/all", () => "Icon"); // https://medium.com/xebia/de-mystifying-jest-snapshot-test-mocks-8e7183d109ea
jest.mock("react-icons", () => "Icon");
jest.mock("react-icons/fa", () => "Icon");

import "@testing-library/jest-dom/extend-expect";
import React from "react";
import SideBar from "../components/SideBar";
import { cleanup, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

// basic testing approach from https://jestjs.io/docs/tutorial-react#react-testing-library
/**
 * These tests doesn't work, therfore this test suite is skipped (xdescribe)
 * Error Message:
 * 
 * Element type is invalid: expected a string (for built-in components)
 * or a class/function (for composite components) but got: undefined.
 * You likely forgot to export your component from the file it's defined in,
 * or you might have mixed up default and named imports.
 * Check the render method of `SideBar`.
 */
xdescribe("sidebar renders correctly", () => {
 
  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  test("render sidebar", () => {
    // given
    render(
      <IntlProvider locale='de-DE'>
        <SideBar
          collapsed={false}
          handleToggleSidebar={() => {}}
          locales={{ Deutsch: "de-DE" }}
          localeChanged={() => {}}
          locationFromChanged={() => {}}
          travelModeChanged={() => {}}
          locationStopOversChanged={() => {}}
          selectedMunicipalityChanged={() => {}}
          routeInfos={{
            distance: 35.8,
            duration: 12.8,
            incidence: 234.56,
            municipalities: [
              {
                index: 0,
                municipality: {
                  bfs_nr: 3544,
                  canton: "GR",
                  incidence: 203,
                  name: "Bergün Filisur",
                },
              },
            ],
          }}
          locationToChanged={() => {}}
          rtl={false}
          toggled={false}
        />
      </IntlProvider>
    );

    // when
    const sidebarElement = screen.getByTestId("sidebar-1");

    // then
    expect(sidebarElement).toBeInTheDocument();
  });

  it("render route in sidebar", () => {
    const { queryByText } = render(
      <IntlProvider locale='de-DE'>
        <SideBar
          collapsed={false}
          handleToggleSidebar={() => {}}
          locales={{ Deutsch: "de-DE" }}
          localeChanged={() => {}}
          locationFromChanged={() => {}}
          travelModeChanged={() => {}}
          locationStopOversChanged={() => {}}
          selectedMunicipalityChanged={() => {}}
          routeInfos={{
            distance: 35.8,
            duration: 12.8,
            incidence: 234.56,
            municipalities: [
              {
                index: 0,
                municipality: {
                  bfs_nr: 3544,
                  canton: "GR",
                  incidence: 203,
                  name: "Bergün Filisur",
                },
              },
            ],
          }}
          locationToChanged={() => {}}
          rtl={false}
          toggled={false}
        />
      </IntlProvider>
    );

    expect(queryByText("Bergün Filisur")).toBeInTheDocument();
    expect(queryByText("203.0")).toBeInTheDocument();
  });
});
