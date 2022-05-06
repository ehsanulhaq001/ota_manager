import React from "react";
import ReactSelect from "./ReactSelect";
import { useEffect, useState } from "react";

import axios from "axios";
export default function InputBox(qrs, setQrs, setInputBoxVis) {
  const [arts, setArts] = useState([]);

  useEffect(() => {
    (async () => {
      let x = [];
      await getResponse("2").then((res) => {
        res.list_artifacts.map((rs) => x.push(rs.name));
      });
      setArts(x);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handle_art_name_change = (e) => {
    setQrs && setQrs(qrs && qrs + "&artifact_name_to_deploy=" + e.value);
  };

  const getResponse = async (cmd, args = "") => {
    let response;
    const headers = {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken:ehsan"),
    };
    const url =
      "https://egyek8hnrb.execute-api.us-west-2.amazonaws.com/e_mender";
    try {
      await axios
        .get(url + "?cmd=" + cmd + args, {
          headers: headers,
        })
        .then((res) => (response = res.data));
    } catch (error) {
      response = error.message;
    }

    return response;
  };

  return (
    <div className="inputBox">
      <input type="text" placeholder="Deployment Name" />
      {arts && (
        <ReactSelect
          opts={arts}
          def={{
            value: arts[0],
            label: arts[0],
            color: "var(--c4)",
          }}
          handleChange={handle_art_name_change}
          them={1}
          vw={13}
        />
      )}
      {/* <input type="text" placeholder="Artifact to Deploy Name" /> */}
      <button
        onClick={() => {
          setInputBoxVis && setInputBoxVis(false);
        }}
      >
        SEND
      </button>
    </div>
  );
}
