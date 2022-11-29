import CardPreview from "../components/CardPreview";
import { useState, useEffect, useCallback } from "react";
import { useAPI } from "../hooks/useAPI";
import linkTypes from "../util/linkTypes";
import debounce from "../util/debounce";

const Directory = () => {
  const api = useAPI();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [linkTypeFilter, setLinkTypeFilter] = useState(null);

  useEffect(() => {
    const abort = getData(searchQuery, linkTypeFilter);

    return () => abort.abort();
  }, [searchQuery, linkTypeFilter]);

  function getData(searchQuery = null, linkTypeFilter = null) {
    if (searchQuery === "") searchQuery = null;

    const abort = new AbortController();
    api
      .get("card", {
        signal: abort.signal,
        params: {
          searchQuery,
          linkTypeFilter,
        },
      })
      .then((res) => {
        const newData = res?.data?.cards;
        if (newData) setData(newData);
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        console.log(err);
      });

    return abort;
  }

  function ascend() {
    const sortedData = [...data].sort((a, b) => {
      return a.userName > b.userName ? 1 : -1;
    });
    setData(sortedData);
  }
  function descend() {
    const sortedData = [...data].sort((a, b) => {
      return a.userName < b.userName ? 1 : -1;
    });
    setData(sortedData);
  }

  const handleSearchChanged = useCallback(
    debounce((ev) => {
      const inputValue = ev.target.value;
      const value = inputValue === "" ? null : inputValue;

      setSearchQuery(value);
    })
  );

  function handleFilterChanged(ev) {
    const inputValue = ev.target.value;
    const value = inputValue == -1 ? null : inputValue;

    setLinkTypeFilter(value);
  }

  const listUsers = data.map((object) => {
    return (
      <CardPreview
        key={object.username}
        cardInitials={object.username.slice(0, 2).toUpperCase()}
        username={object.username}
      />
    );
  });
  return (
    <div>
      <h1 className="text-5xl flex justify-center p-5">Directory</h1>
      <div className="card-actions flex justify-evenly p-4 ">
        <button className="btn btn-primary" onClick={ascend}>
          Ascend
        </button>
        <button className="btn btn-accent" onClick={descend}>
          Descend
        </button>
        <div className="form-control">
          <div className="input-group">
            <select
              onChange={handleFilterChanged}
              className="select select-bordered"
            >
              <option defaultValue={true} value={-1}>
                All link types
              </option>
              {linkTypes.map((type, idx) => (
                <option key={idx} value={idx}>
                  {type.name}
                </option>
              ))}
            </select>
            <button className="btn">Go</button>
          </div>
        </div>
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search users�"
              className="input input-bordered"
              onChange={handleSearchChanged}
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-evenly">{listUsers}</div>
    </div>
  );
};
export default Directory;
