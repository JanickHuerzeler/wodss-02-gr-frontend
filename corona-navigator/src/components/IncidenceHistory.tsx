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
const DefaultApiConfig = new Configuration({
  basePath: process.env.REACT_APP_SERVER_URL,
});
const API = new DefaultApi(DefaultApiConfig);

/**
 * Render the TODO:
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
  };

  //   public handleClick = (evt: any) => alert("click");
  //   public handleHover = (evt: any) => alert("hover");

  /**
   * load the incidences for the current selected municipality
   * and set it to the state
   */
  loadData = () => {
    API.cantonsCantonMunicipalitiesBfsNrIncidencesGet(
      this.props.selectedMunicipality!.canton!,
      this.props.selectedMunicipality!.bfs_nr!.toString(),
      moment(this.state.dateFrom).format("YYYY-MM-DD"),
      moment(this.state.dateTo).format("YYYY-MM-DD"),
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
        console.log(error.message);
        this.setState(
          (state: IncidenceHistoryState, props: IncidenceHistoryProps) => ({
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
          loaded: false
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
          loaded: false
        })
      );
      this.loadData();
    }
  }

  /**
   * Separate render method for the plotly.js chart, which can be called within a condition
   * @returns {JSX.Element}
   */
  renderIncidences = () => {
    const data = [
      {
        type: "bar",
        x: this.state.data.map((dt) => dt.timestamp),
        y: this.state.data.map((dt) => dt.value),
        marker: { color: "#6475b1" },
      },
    ];
    const layout = {
      title: {
        text:
          this.props.intl.formatMessage({ id: "chartTitle" }) +
          this.props.selectedMunicipality?.name,
        font: {
          size: 20,
        },
        x: 0.04,
        y: 0.9,
        xanchor: "left",
        yanchor: "bottom",
      },
      xaxis: {
        title: this.props.intl.formatMessage({ id: "chartXTitle" }),
        margin: {
          t: 50,
          b: 10,
          l: 0,
          r: 0,
          pad: 5,
        },
        automargin: false,
      },
      autosize: false,
      width: 800,
      height: 200,
      yaxis: {
        title: this.props.intl.formatMessage({ id: "chartYTitle" }),
        automargin: true,
      },
      margin: {
        l: 20,
        r: 20,
        b: 60,
        t: 60,
        pad: 4,
      },
      paper_bgcolor: "rgba(0,0,0,0.5)",
      plot_bgcolor: "rgba(0,0,0,0.5)",
      bgcolor: "#4c5c96",
      bordercolor: "#4c5c96",
      font: { size: 10, color: "#fff" },
    };
    return (
      <div className='incidencePlotly'>
        <PlotlyChart
          data={data}
          layout={layout}
          config={{displayModeBar: true, modeBarButtonsToRemove: ['lasso2d','toggleSpikelines']}}
          // onClick={this.handleClick}
          // onHover={this.handleHover}
        />
        <select
          className='incidencechart-interval-select'
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            this.intervalChanged(e.target.value)
          }
        >
          {this.intervalOptions.map((dt: IntervalOption) => {
            return (
              <option value={moment(dt.date).format("YYYY-MM-DD")} key={dt.key}>
                {this.props.intl.formatMessage({ id: dt.key })}
              </option>
            );
          })}
        </select>
        <div className="closeIncidencePlotlyWrapper">
        <span
          className='closeIncidencePlotly'
          onClick={this.props.closeIncidenceChart}
        >
          X
        </span>
        </div>
        <span className='loadingIncidences' hidden={this.state.loaded}>
          {this.props.intl.formatMessage({id: "chartLoading"})}
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
        {this.props.selectedMunicipality 
          ? this.renderIncidences()
          : null}
      </div>
    );
  }
}

export default injectIntl(IncidenceHistory);
