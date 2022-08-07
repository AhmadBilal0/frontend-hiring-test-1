import React, { Component } from "react";
import { Container } from "./styles";
import MissedCall from "../../assets/img/phone-call-svgrepo-com.svg";
import CallService from "../../services/CallService";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Loading from "../../assets/gifs/loading.gif";
import arrowDown from "../../assets/img/arrow-down-3101.svg";
import arrowUp from "../../assets/img/arrow-up.svg";
import Pagination from "react-js-pagination";

export interface Note {
  id: string;
  content: string;
}

export interface Call {
  call_type: string;
  created_at: string;
  direction: string;
  duration: number;
  from: string;
  id: string;
  is_archived: boolean;
  notes: Note[];
  to: string;
  via: string;
}

export interface RequestState {
  [key: string]: any;
  values: Call[];
  submitSuccess: boolean;
  loading: boolean;
  offset?: any;
  limit?: any;
  totalCount: number;
  hasNextPage: boolean;
  detail: boolean;
  types_call: string[];
  type_call: string;
  group_call: [];
}

class Calls extends React.Component<RouteComponentProps, RequestState> {
  listOfCalls: string[] = [];
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      call_type: "",
      created_at: "",
      direction: "",
      duration: 0,
      from: "",
      id: "",
      is_archived: false,
      notes: [],
      to: "",
      via: "",
      values: [],
      submitSuccess: false,
      loading: false,
      offset: 1,
      limit: 30,
      totalCount: 1,
      hasNextPage: true,
      detail: false,
      types_call: [],
      type_call: "All",
      group_call: [],
    };
  }
  async componentDidMount() {
    await this.getCalls();
  }

  async getCalls() {
    this.setState({ loading: true });
    const request = new CallService();
    try {
      await request.getCalls(this.state.offset, this.state.limit).then(
        (success) => {
          this.setState({
            submitSuccess: true,
            values: success.nodes,
            hasNextPage: success.hasNextPage,
            totalCount: success.totalCount,
            loading: false
          });
          this.onlyUniqueTypeCall();
          this.setGroupCallValues();
        })
    } catch (e) {
      console.log(e);
      this.setState({ loading: false, submitSuccess: false });
    }
  }

  onlyUniqueTypeCall() {
    let arrayTemp: string[] = [];
    let valueState = this.state;
    for (let item of valueState.values) {
      if (!arrayTemp.includes(item.call_type)) {
        arrayTemp.push(item.call_type);
      }
      this.setState({ types_call: arrayTemp });
    }
  }

  async handleTypeCallChange(value: any) {
    await this.setState({ type_call: value });
    this.setGroupCallValues();
  }

  archiveCall(id: string) {
    this.setState({ loading: true, submitSuccess: false });
    const request = new CallService();
    request.updateCalls(id).then(
      () => {
        this.setState({ loading: false, submitSuccess: true });
        this.getCalls();
      },
      (error) => {
        this.setState({ loading: false, submitSuccess: true });
      }
    );
  }

  async handlePageChange(pageNumber: number) {
    await this.setState({ offset: pageNumber });
    this.getCalls();
  }

  toggleDetailCall(id: any) {
    if (this.listOfCalls.includes(id)) {
      this.removeArray(id);
    } else {
      this.listOfCalls.push(id);
      this.setState({ detail: true });
    }
    this.forceUpdate();
  }

  removeArray(element: any) {
    const index = this.listOfCalls.indexOf(element);

    if (index !== -1) {
      this.listOfCalls.splice(index, 1);
    }
    this.setState({ detail: false });
  }

  setGroupCallValues = async () => {
    let groupBy = this.groupBy(this.state.values);
    await this.setState({ group_call: groupBy });
  }

  groupBy = (xs: Call[]) => {
    return xs.reduce((rv: any, x: any) => {
      (this.state.type_call !== 'All' ? x.call_type === this.state.type_call : x) &&
        (rv[new Date(x.created_at).toLocaleDateString()] =
          rv[new Date(x.created_at).toLocaleDateString()] || []).push(x);
      return rv;
    }, {});
  };

  render() {
    const { loading } = this.state;
    return (
      <Container>
        <div className="content">
          {loading ? (
            <div className="loading">
              <img src={Loading} width="100" />
            </div>
          ) : (
            <div className="calls">
              {Object.entries(this.state.group_call)
                .sort().map(([key, value]) => (
                  <div>
                    <select value={this.state.type_call} name="call_type" id="call_type" onChange={e => this.handleTypeCallChange(e.target.value)}>
                      <option value="All">All</option>
                      {this.state.types_call.map((type, key) =>
                        <option key={key} value={type}>{type}</option>
                      )}
                    </select>
                    <div className="group-call">
                      <div className="key">
                        <hr />
                        <span>
                          {key}
                        </span>
                        <hr />
                      </div>
                      <div className="row">
                        {Object(value).map((item: any) => (
                          <div className="d-flex col-sm-12 col-lg-3 mt-3 ">
                            <div className="card bg-secondary text-white" key={item.id}>
                              <div className="card-body">

                                <div className="card-title">
                                  <h3><img style={{ marginRight: "10px" }} src={MissedCall} alt="" width="20" />
                                    Call from: {item.from}</h3>
                                </div>
                                <div className="card-subtitle">{new Date(item.created_at).toLocaleTimeString()} </div>
                                <div className="row">
                                  <div className="col-8">
                                    <span>Tried to call on {item.to}</span>
                                  </div>
                                  <div className="col-4">
                                    <div className="btn " style={{ "backgroundColor": "#c8c8c8", "color": "white", maxWidth: "6rem" }} onClick={(e) => this.archiveCall(item.id)}>
                                      {item.is_archived ? 'Unarchive' : 'Archive'}
                                    </div>
                                  </div>
                                </div>
                                {this.listOfCalls.includes(item.id) ? (
                                  <div className="detail">
                                    <hr />
                                    <div>
                                      <div className="description">
                                        <span className="title">Created at: </span>
                                        <span>
                                          {new Date(
                                            item.created_at
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="description">
                                        <span className="title">Duration: </span>
                                        <span>{item.duration}</span>
                                      </div>
                                      <div className="description">
                                        <span className="title">Call type: </span>
                                        <span>{item.call_type}</span>
                                      </div>
                                      <div className="description">
                                        <span className="title">Notes: </span>
                                        {item.notes.length >= 1 ? (
                                          item.notes.map((note: any, key: any) => (
                                            <span key={key}>{note.content}</span>
                                          ))
                                        ) : (
                                          <span>No notes</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                                <div className="footer">
                                  <img
                                    onClick={(e) => this.toggleDetailCall(item.id)}
                                    src={
                                      this.listOfCalls.includes(item.id)
                                        ? arrowUp
                                        : arrowDown
                                    }
                                    alt=""
                                    width="12"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              <Pagination
                activePage={this.state.offset}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={this.state.totalCount}
                pageRangeDisplayed={3}
                onChange={this.handlePageChange.bind(this)}
              />
            </div>
          )}
        </div>
      </Container>
    );
  }
}

export default withRouter(Calls);
