import React, { ChangeEvent, Component } from "react";
import PlotlyChart from "react-plotlyjs-ts";
import { injectIntl, WrappedComponentProps } from "react-intl";
import {
  IncidenceHistoryProps,
  IncidenceHistoryState,
  IntervalOption,
} from "../types/IncidenceHistory";
import { Configuration, DefaultApi, IncidenceDTO } from "../api";
import moment from "moment";
import "../scss/IncidenceHistory.scss";
import chartConfig from "../resources/chart.config";
const DefaultApiConfig = new Configuration({
  basePath: process.env.REACT_APP_SERVER_URL,
});
const API = new DefaultApi(DefaultApiConfig);
const TIME_FORMAT_API = "YYYY-MM-DD";

/**
 * Render the incidence chart for the given municipality
 */
class IncidenceHistory extends Component<
  IncidenceHistoryProps & WrappedComponentProps,
  IncidenceHistoryState
> {
  private intervalOptions: IntervalOption[] = [
    { key: "interval14", date: moment(new Date()).subtract(14, "d") },
    { key: "interval7", date: moment(new Date()).subtract(7, "d") },
    { key: "intervalAll", date: moment(new Date("2019-02-26")) },
  ];

  // set default state
  state: IncidenceHistoryState = {
    dateFrom: moment(new Date()).subtract(15, "d"),
    dateTo: moment(new Date()).subtract(1, "d"),
    data: [],
    loaded: false,
    selectedMunicipality: undefined,
    previousDateFrom: undefined,
    currentWindowWidth: window.innerWidth,
  };

  /**
   * load the incidences for the current selected municipality
   * and set it to the state
   */
  loadData = () => {
    API.cantonsCantonMunicipalitiesBfsNrIncidencesGet(
      this.props.selectedMunicipality!.canton!,
      this.props.selectedMunicipality!.bfs_nr!.toString(),
      moment(this.state.dateFrom).format(TIME_FORMAT_API),
      moment(this.state.dateTo).format(TIME_FORMAT_API),
      this.props.selectedLocale
    ).then(
      (response: { data: IncidenceDTO[] }) => {
        const dataSeries = response.data.map((dt: IncidenceDTO) => {
          return { timestamp: new Date(dt.date!), value: dt.incidence! };
        });

        this.setState(
          (state: IncidenceHistoryState, props: IncidenceHistoryProps) => ({
            data: dataSeries,
            loaded: true,
          })
        );
      },
      (error: Error) => {
        console.error(error.message);

        this.showToast(
          this.props.intl.formatMessage({ id: "error" }),
          this.props.intl
            .formatMessage({ id: "chartDataNotAvailable" })
            .replaceAll("{CT}", this.props.selectedMunicipality!.canton!)
        );

        this.setState(
          (state: IncidenceHistoryState, props: IncidenceHistoryProps) => ({
            data: [],
            loaded: true,
          })
        );
      }
    );
  };

  /**
   * Sets the dateFrom which reloads the data for the given municipality with the new dateFrom parameter.
   * @param {string} intervalDateString - the date string of the selected Moment Date
   */
  intervalChanged = (intervalDateString: string) => {
    this.setState(
      (state: IncidenceHistoryState, props: IncidenceHistoryProps) => ({
        dateFrom: moment(new Date(intervalDateString)),
      })
    );
  };

  /**
   * Fetch data and display the chart only if the municipality or the chart interval has changed.
   */
  componentDidUpdate() {
    if (
      this.props.selectedMunicipality === undefined &&
      this.props.selectedMunicipality !== this.state.selectedMunicipality
    ) {
      this.setState(
        (state: IncidenceHistoryState, props: IncidenceHistoryProps) => ({
          selectedMunicipality: this.props.selectedMunicipality,
          dateFrom: this.intervalOptions[0].date,
          data: [],
          loaded: false,
        })
      );
    }
    if (
      this.props.selectedMunicipality &&
      (this.props.selectedMunicipality !== this.state.selectedMunicipality ||
        this.state.dateFrom !== this.state.previousDateFrom)
    ) {
      this.setState(
        (state: IncidenceHistoryState, props: IncidenceHistoryProps) => ({
          selectedMunicipality: this.props.selectedMunicipality,
          previousDateFrom: this.state.dateFrom,
          data: [],
          loaded: false,
        })
      );
      this.loadData();
    }
  }

  /**
   * Add eventlistener for windows resize
   */
  componentDidMount() {
    window.addEventListener("resize", this.setWindowWidth);
  }

  /**
   * Remove eventlistener for windows resize
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.setWindowWidth);
  }

  /**
   * Window size handler for redraw event of the plotly chart.
   * Needed for resizing the chart, if the windows resizes.
   */
  setWindowWidth = () => {
    this.setState(
      (state: IncidenceHistoryState, props: IncidenceHistoryProps) => ({
        currentWindowWidth: window.innerWidth,
      })
    );
  };

  /**
   * Show toast in parent component
   * @param {string} toastTitle   - title to display
   * @param {string} toastMessage - message to display
   */
  showToast(toastTitle: string, toastMessage: string) {
    this.props.errorOccured(toastTitle, toastMessage);
  }

  /**
   * Separate render method for the plotly.js chart, which can be called within a condition
   * @returns {JSX.Element}
   */
  renderIncidences = () => {
    // prepare the data structure
    const data = [
      {
        type: "bar",
        x: this.state.data.map((dt) => dt.timestamp), 
        y: this.state.data.map((dt) => dt.value),
        marker: {
          color: chartConfig.CHART_BAR_MARKER_COLOR,
        },
      },
    ];
    // configure the chart layout
    const layout = {
      title: {
        text:
          this.props.intl.formatMessage({ id: "chartTitle" }) +
          this.props.selectedMunicipality?.name,
        font: {
          family: chartConfig.CHART_FONT_FAMILY,
          size:
            this.state.currentWindowWidth <=
            chartConfig.CHART_SMALL_WINDOW_THRESHOLD
              ? chartConfig.CHART_FONT_TITLE_SIZE_SMALL
              : chartConfig.CHART_FONT_TITLE_SIZE_LARGE,
        },
        x: chartConfig.CHART_TITLE_OFFSET_X,
        y: chartConfig.CHART_TITLE_OFFSET_Y,
        xanchor: "left",
        yanchor: "bottom",
      },
      xaxis: {
        title: this.props.intl.formatMessage({ id: "chartXTitle" }),
        margin: {
          t: chartConfig.CHART_XAXIS_MARGIN_TOP,
          b: chartConfig.CHART_XAXIS_MARGIN_BOTTOM,
          l: chartConfig.CHART_XAXIS_MARGIN_LEFT,
          r: chartConfig.CHART_XAXIS_MARGIN_RIGHT,
          pad: chartConfig.CHART_XAXIS_PADDING,
        },
        automargin: false,
        // https://plotly.com/javascript/hover-text-and-formatting/#rounding-x-and-y-hover-values
        hoverformat: '%d.%m.%Y'
      },
      autosize: true,
      width:
        this.state.currentWindowWidth <=
        chartConfig.CHART_SMALL_WINDOW_THRESHOLD
          ? window.innerWidth - chartConfig.CHART_WINDOW_OFFSET_SMALL
          : window.innerWidth - chartConfig.CHART_WINDOW_OFFSET_LARGE >
            chartConfig.CHART_SMALL_WINDOW_THRESHOLD
          ? chartConfig.CHART_SMALL_WINDOW_THRESHOLD
          : window.innerWidth - 400,
      height: chartConfig.CHART_HEIGHT,
      yaxis: {
        title: this.props.intl.formatMessage({ id: "chartYTitle" }),
        automargin: true,
      },
      margin: {
        l: chartConfig.CHART_MARGIN_LEFT,
        r: chartConfig.CHART_MARGIN_RIGHT,
        b: chartConfig.CHART_MARGIN_BOTTOM,
        t: chartConfig.CHART_MARGIN_TOP,
        pad: chartConfig.CHART_PADDING,
      },
      paper_bgcolor: chartConfig.CHART_BG_COLOR,
      plot_bgcolor: chartConfig.CHART_BG_COLOR,
      bgcolor: chartConfig.CHART_BAR_COLOR,
      bordercolor: chartConfig.CHART_BAR_COLOR,
      font: {
        family: chartConfig.CHART_FONT_FAMILY,
        size: chartConfig.CHART_FONT_SIZE,
        color: chartConfig.CHART_FONT_COLOR,
      },
    };

    return (
      <div className='incidencePlotly'>
        {/* Plotly chart component for incidence bar chart of municipality */}
        <PlotlyChart
          data={data}
          layout={layout}
          onRedraw={() => this.setWindowWidth}
          config={{
            displayModeBar:
              this.state.currentWindowWidth >=
              chartConfig.CHART_LARGE_WINDOW_THRESHOLD,
            responsive: true,
            modeBarButtonsToRemove: ["lasso2d", "toggleSpikelines"],
          }}
        />
        {/* Chart interval selection */}
        <select
          className='incidencechart-interval-select'
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            this.intervalChanged(e.target.value)
          }
        >
          {this.intervalOptions.map((dt: IntervalOption) => {
            return (
              <option value={moment(dt.date).format(TIME_FORMAT_API)} key={dt.key}>
                {this.props.intl.formatMessage({ id: dt.key })}
              </option>
            );
          })}
        </select>
        {/* Close button */}
        <div className='closeIncidencePlotlyWrapper'>
          <span
            className='closeIncidencePlotly'
            onClick={this.props.closeIncidenceChart}
          >
            X
          </span>
        </div>
        {/* Loading indicator */}
        <span className='loadingIncidences' hidden={this.state.loaded}>
          {this.props.intl.formatMessage({ id: "chartLoading" })}
        </span>
      </div>
    );
  };

  /**
   * Render HTMl output
   */
  public render() {
    return (
      <div>
        {this.props.selectedMunicipality ? this.renderIncidences() : null}
      </div>
    );
  }
}

export default injectIntl(IncidenceHistory);
