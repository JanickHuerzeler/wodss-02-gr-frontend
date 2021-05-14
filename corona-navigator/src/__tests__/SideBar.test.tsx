jest.mock("react-icons/all", () => "Icon"); // https://medium.com/xebia/de-mystifying-jest-snapshot-test-mocks-8e7183d109ea
jest.mock("react-icons", () => "Icon");
jest.mock("react-icons/fa", () => "Icon");

import "@testing-library/jest-dom/extend-expect";
import React from "react";
import SideBar from "../components/SideBar";
import { cleanup, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

/**
 * https://stackoverflow.com/a/57013472
 * xdescribe = alias for skipping test suite
 * xtest = alias for skipping a specific test
 */

xdescribe("sidebar renders correctly", () => {
  // clean up renderer after each test
  afterEach(() => {
    cleanup();
  });

  
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
});
