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
    
    test("render infobubble", () => {
      // given
      const currentDate = new Date();
      render(
        <IntlProvider locale='de-DE'>
          <InfoBubble
            lat={"47.390434"}
            lng={"8.0457015"}
            data={{
              show: true,
              lat: "47.390434",
              lng: "8.0457015",
              name: "Aarau",
              zip: 5001,
              incidence: 132.092,
              date: currentDate.toString(),
            }}
          />
        </IntlProvider>
      );

      // when
      const infobubbleElement = screen.getByTestId("municipality-zip-name");
      const infobubbleIncidenceElement = screen.getByTestId(
        "municipality-incidence"
      );
      const infobubbleDateElement = screen.getByTestId("municipality-date");

      // then
      expect(infobubbleElement).toBeInTheDocument();
      expect(infobubbleElement).toHaveTextContent("5001 Aarau");
      expect(infobubbleIncidenceElement).toBeInTheDocument();
      expect(infobubbleIncidenceElement).toHaveTextContent("132.1");
      expect(infobubbleDateElement).toBeInTheDocument();
      expect(infobubbleDateElement).toHaveTextContent(
        moment(currentDate).format("DD.MM.YYYY")
      );
    });


      test("render info missing incidence", () => {
        // given
        render(
          <IntlProvider locale='de-DE'>
            <InfoBubble
              lat={"47.390434"}
              lng={"8.0457015"}
              data={{
                show: true,
                lat: "47.390434",
                lng: "8.0457015",
                name: "Aarau",
                zip: 5001,
                incidence: undefined,
                date: undefined,
              }}
            />
          </IntlProvider>
        );

        // when
        const infobubbleElement = screen.getByTestId("municipality-zip-name");
        const infobubbleIncidenceElement = screen.getByTestId(
          "municipality-incidence"
        );
        const infobubbleDateElement = screen.getByTestId("municipality-date");

        // then
        expect(infobubbleElement).toBeInTheDocument();
        expect(infobubbleElement).toHaveTextContent("5001 Aarau");
        expect(infobubbleIncidenceElement).toBeInTheDocument();
        expect(infobubbleIncidenceElement).toHaveTextContent("?");
        expect(infobubbleDateElement).toBeInTheDocument();
        expect(infobubbleDateElement).toHaveTextContent("?");
      });
});

