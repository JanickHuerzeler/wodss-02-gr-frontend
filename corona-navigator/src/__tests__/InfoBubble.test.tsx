jest.mock("react-icons/all", () => "Icon"); // https://medium.com/xebia/de-mystifying-jest-snapshot-test-mocks-8e7183d109ea
jest.mock("react-icons", () => "Icon");
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import InfoBubble from "../components/InfoBubble";
import moment from "moment";

describe("infobubble component renders correctly", () => {
    // clean up renderer after each test
    afterEach(() => {
        cleanup();
    });
    
    // in test file.
    beforeAll(() => {});

    test("render infobubble", () => {
        // given
        const currentDate = new Date();
        render(
          <IntlProvider locale='de-DE'>
            <InfoBubble lat={""} lng={""} data={
                {
                  show:       true,
                  lat:        "",
                  lng:        "",
                  name:       "Aarau",
                  zip:        5001,
                  incidence:  132.092,
                  date:       currentDate.toString(),
                }
            } />
          </IntlProvider>
        );
      
        // when
        const infobubbleElement = screen.getByTestId("municipality-zip-name");
        const infobubbleIncidenceElement = screen.getByTestId("municipality-incidence");
        const infobubbleDateElement = screen.getByTestId("municipality-date");
      
        // then
        expect(infobubbleElement).toBeInTheDocument();
        expect(infobubbleElement).toHaveTextContent("5001 Aarau");
        expect(infobubbleIncidenceElement).toBeInTheDocument();
        expect(infobubbleIncidenceElement).toHaveTextContent("132.1");
        expect(infobubbleDateElement).toBeInTheDocument();
        expect(infobubbleDateElement).toHaveTextContent(moment(currentDate).format("DD.MM.YYYY"));
      });
});

