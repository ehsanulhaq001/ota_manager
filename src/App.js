/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import ReactSelect from "./ReactSelect.js";
import axios from "axios";

import AWS from "aws-sdk";
// import loginLogo from "./loginLogo.svg";
import refreshIcon from "./refreshIcon.svg";

AWS.config.update({ region: "us-west-2" });

function App({ setUserAuthorized }) {
  const urls = [
    {
      method: "GET",
      baseUrls: [
        {
          base: "api/management/v1/useradm/users",
          ends: [""],
        },
        {
          base: "api/management/v1/deployments/list",
          ends: [""],
        },
        {
          base: "api/management/v1/deployments/deployments/releases/list",
          ends: [""],
        },
        {
          base: "api/management/v1/inventory/devices",
          ends: [""],
        },
        {
          base: "api/management/v1/auditlogs/logs",
          ends: [""],
        },
        {
          base: "api/management/v1/deployments/deployments",
          ends: ["/all", "/finished", "/inprogress", "/pending"],
        },
      ],
    },
    {
      method: "POST",
      baseUrls: [
        {
          base: "api/management/v1/deployments/deployments",
          ends: [""],
        },
      ],
    },
  ];

  const [method, setMethod] = useState("GET");
  const [baseUrls, setBaseUrls] = useState(
    urls[0].baseUrls.map((url) => url.base)
  );
  const [endUrls, setEndUrls] = useState(urls[0].baseUrls[0].ends);
  const [baseUrl, setBaseUrl] = useState(
    urls[0].baseUrls.map((url) => url.base)[0]
  );
  const [endUrl, setEndUrl] = useState(urls[0].baseUrls[0].ends[0]);

  const [loaded, setLoaded] = useState(true);

  const [jsonResponse, setJsonResponse] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [responseDuration, setResponseDuration] = useState("");

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [menderFileName, setMenderFileName] = useState("");
  const [sendOrMore, setSendOrMore] = useState("SEND");

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const getS3Credentials = async () => {
    let res;
    await getResponse("s3key").then((data) => {
      res = data.key;
    });
    return res;
  };

  const [uploaded1, setUploaded1] = useState(true);
  const [uploaded2, setUploaded2] = useState(true);

  const handle_upload_to_s3 = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploaded1(false);

    let s3 = new AWS.S3(await getS3Credentials());

    let params = {
      Bucket: "e-storage-bucket",
      Key: selectedFile.name,
      Body: selectedFile,
    };

    s3.putObject(params, (err) => {
      if (err) setUploaded1(false);
      else setUploaded1(true);
    });
    setMenderFileName(selectedFile.name);
  };

  const handle_file_name_change = (e) => {
    setMenderFileName(e.target.value);
  };

  const handle_upload_to_mender = async (e) => {
    e.preventDefault();
    setUploaded1(false);
    await getResponse("01&artifact_name=" + menderFileName).then((data) => {
      setJsonResponse(JSON.stringify(data, null, 4));
    });
    setUploaded1(true);
  };

  const handle_deploy_to_mender = async (e) => {
    e.preventDefault();
    setUploaded1(false);

    await getResponse(
      "02",
      "&deployment_name=" +
        deployName +
        "&artifact_name_to_deploy=" +
        deployArt +
        "&group_to_deploy_to=" +
        deployGrp
    ).then((data) => {
      setJsonResponse(JSON.stringify(data, null, 4));
    });
    setUploaded1(true);
  };

  useEffect(() => {
    let i;
    if (method === "GET") i = 0;
    else if (method === "POST") i = 1;
    let list = urls[i].baseUrls.map((url) => url.base);
    setBaseUrls(list);
    setBaseUrl(urls[i].baseUrls.map((url) => url.base)[0]);
    setEndUrl(urls[i].baseUrls[0].ends[0]);
  }, [method]);

  useEffect(() => {
    let i;
    if (method === "GET") i = 0;
    else if (method === "POST") i = 1;
    let ends = urls[i].baseUrls.find((url) => url.base === baseUrl)?.ends;
    if (ends?.length) setEndUrls(ends);
  }, [baseUrl, method]);

  useEffect(() => {
    setEndUrl(endUrls[0]);
  }, [endUrls]);

  const handle_method_change = (method) => {
    if (method === "GET") setSendOrMore("SEND");
    else setSendOrMore("MORE");
    setMethod(method);
  };
  const handle_base_url_change = (event) => {
    setBaseUrl(event.value);
  };
  const handle_end_url_change = (event) => {
    setEndUrl(event.value);
  };
  const handle_send = async () => {
    // let start = new Date().getTime();
    setLoaded(false);

    const request = `${baseUrl}${endUrl}`;
    console.log(`${method} ${baseUrl}${endUrl}`);

    if (method === "GET") {
      switch (request) {
        case "api/management/v1/useradm/users":
          await getResponse("1").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "api/management/v1/deployments/deployments/releases/list":
          await getResponse("2").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "api/management/v1/deployments/list":
          await getResponse("3").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "api/management/v1/auditlogs/logs":
          await getResponse("4").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "api/management/v1/inventory/devices":
          await getResponse("5").then((data) => {
            let devices = [];
            data = data.list_devices;
            data.forEach((device) => {
              devices.push(
                device.attributes.find((attribute) => attribute.name === "mac")
                  .value
              );
            });
            setJsonResponse(JSON.stringify(devices, null, 4));
          });
          break;
        case "api/management/v1/deployments/deployments/all":
          await getResponse("3").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "api/management/v1/deployments/deployments/finished":
          await getResponse("6").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "api/management/v1/deployments/deployments/inprogress":
          await getResponse("7").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "api/management/v1/deployments/deployments/pending":
          await getResponse("8").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
      }
    } else if (method === "POST") {
      switch (request) {
        case "api/management/v1/deployments/deployments":
          await getResponse(
            "02",
            "&deployment_name=" +
              "test" +
              "&artifact_name_to_deploy=" +
              "test" +
              "&devices_to_deploy_to=" +
              "test"
          ).then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
        case "/api/devices/v1/deployments/list3":
          await getResponse("3").then((data) => {
            setJsonResponse(JSON.stringify(data, null, 4));
          });
          break;
      }
    }
    // let end = new Date().getTime();
    // setResponseDuration(end - start);
    // setResponseTime(new Date().toLocaleTimeString());
    setLoaded(true);
  };

  const getResponse = async (cmd, args = "") => {
    let start = new Date().getTime();
    if (!checkToken()) {
      localStorage.clear();
      setUserAuthorized(false);
    }
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
    let end = new Date().getTime();

    setResponseDuration(end - start);
    setResponseTime(new Date().toLocaleTimeString());
    return response;
  };

  const inputRef = useRef(null);
  const handle_input_button_click = () => {
    inputRef.current.click();
  };

  const [showFileDetails, setShowFileDetails] = useState(false);
  const [artList, setArtList] = useState();
  const [deployArt, setDeployArt] = useState("");
  const [deployName, setDeployName] = useState("");
  const [showArtDetails, setShowArtDetails] = useState(false);
  useEffect(() => {
    setUploaded2(false);
    (async () => {
      setUploaded2(false);

      let arts = [];
      await getResponse("2").then((res) => {
        res.list_releases.map((rs) => arts.push(rs.Name));
      });
      setArtList(arts);
      setUploaded2(true);
    })();
  }, [showArtDetails]);

  useEffect(() => {
    if (artList && artList[0]) setDeployArt(artList[0]);
  }, [artList]);

  const [groupList, setGroupList] = useState();
  const [deployGrp, setDeployGrp] = useState("");
  useEffect(() => {
    (async () => {
      let grps = [];

      await getResponse("9").then((res) => {
        res.listDeviceGroups.map((rs) => grps.push(rs));
      });

      setGroupList(grps);
    })();
  }, []);

  useEffect(() => {
    if (groupList && groupList[0]) setDeployGrp(groupList[0]);
  }, [groupList]);

  return (
    <div className="App dark">
      <header className="App-header">
        <span className="title">OTA MANAGER</span>
        <span
          className="userEmailHolder"
          // data-logout="Logout"
          onClick={() => {
            localStorage.clear();
            setUserAuthorized(false);
          }}
        >
          <span className="userEmail">
            {getDataFromJWT(localStorage.getItem("accessToken:ehsan")).email}
          </span>
          <span className="logout">
            Logout
            {/* <img src={loginLogo}></img> */}
          </span>
        </span>
      </header>
      <div className="container">
        <div className="sec sec1">
          <div
            className={`method get ${method === "GET" && "sel"}`}
            onClick={() => handle_method_change("GET")}
          >
            GET
          </div>
          <button
            style={{
              border: "none",
            }}
            disabled
            className={`method post ${method === "POST" && "sel"}`}
            onClick={() => handle_method_change("POST")}
          >
            <span style={{ color: "grey" }} className="main_text">
              POST
            </span>
            <div style={{ color: "grey" }} id="hover-content">
              Disabled
            </div>
          </button>
        </div>
        <div className="sec sec2">
          <div className="urls">
            <div className="base-url">
              <ReactSelect
                opts={baseUrls}
                def={{
                  value: baseUrl,
                  label: baseUrl,
                  color: "var(--c4)",
                }}
                handleChange={handle_base_url_change}
                them={1}
                vw={13}
              />
            </div>
            {endUrl !== "" && (
              <div className="end-url">
                <ReactSelect
                  opts={endUrls}
                  def={{
                    value: endUrl,
                    label: endUrl,
                    color: "var(--c4)",
                  }}
                  handleChange={handle_end_url_change}
                  them={1}
                  vw={13}
                />
              </div>
            )}
            <button className="send" onClick={handle_send}>
              {sendOrMore}
            </button>
          </div>
          {!loaded && <div className="loader-line"></div>}
        </div>

        <div className="sec sec4">
          <button
            className="showList btn"
            onClick={async () => {
              setUploaded1(false);
              await getResponse("s3list").then((data) => {
                setJsonResponse(JSON.stringify(data, null, 4));
              });
              setUploaded1(true);
            }}
          >
            Show Artifacts in S3
          </button>

          <button className="upload s3 btn" onClick={handle_upload_to_s3}>
            Upload to S3
          </button>

          <button
            className="upload mender btn"
            onClick={handle_upload_to_mender}
          >
            Upload to Mender
          </button>
          {!uploaded1 && <div className="loader-line"></div>}

          <div className="holder">
            <button
              className="selectArt btn"
              onClick={handle_input_button_click}
            >
              {!isFilePicked ? "Select artifact" : selectedFile.name}
            </button>
            {isFilePicked && (
              <button
                className="showFileDetails btn"
                onClick={() => {
                  setShowFileDetails(!showFileDetails);
                }}
              >
                {showFileDetails ? <span>&#9650;</span> : <span>&#9660;</span>}
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              name="file"
              onChange={changeHandler}
              style={{ display: "none" }}
            />
            {isFilePicked && showFileDetails && (
              <div className="fileDetails">
                <p>Filename: {selectedFile.name}</p>
                <p>Size: {selectedFile.size} bytes</p>
                <p>
                  Last Modified:{" "}
                  {new Date(selectedFile.lastModified).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <input
            className="textInput"
            type="text"
            placeholder="Enter file_name.mender"
            value={menderFileName}
            onChange={handle_file_name_change}
          />
        </div>
        <div className="sec sec5">
          <div className="holder">
            <div className="artList">
              {artList && artList[0] && (
                <ReactSelect
                  opts={artList}
                  def={{
                    value: artList[0],
                    label: artList[0],
                    color: "var(--text3)",
                  }}
                  handleChange={(e) => {
                    setDeployArt(e.value);
                  }}
                  them={1}
                  vw={13}
                />
              )}
            </div>

            <button
              className="showFileDetails btn"
              onClick={() => {
                setShowArtDetails(!showArtDetails);
              }}
            >
              <img height="25px" src={refreshIcon} alt="" />
            </button>
          </div>
          <div className="holder">
            <div className="groupList">
              {groupList && groupList[0] && (
                <ReactSelect
                  opts={groupList}
                  def={{
                    value: groupList[0],
                    label: groupList[0],
                    color: "var(--text3)",
                  }}
                  handleChange={(e) => {
                    setDeployGrp(e.value);
                  }}
                  them={1}
                  vw={13}
                />
              )}
            </div>
            {groupList && (
              <button
                className="showFileDetails btn devicesInGroup"
                onClick={async () => {
                  setUploaded2(false);

                  await getResponse("10", "&group=" + deployGrp).then(
                    (data) => {
                      setJsonResponse(JSON.stringify(data, null, 4));
                    }
                  );
                  setUploaded2(true);
                }}
              >
                Show
              </button>
            )}
          </div>
          <input
            className="textInput"
            type="text"
            placeholder="Enter Deployment name"
            value={deployName}
            onChange={(e) => {
              setDeployName(e.target.value);
            }}
          />
          <div className="">
            <button className="deploy btn" onClick={handle_deploy_to_mender}>
              Deploy
            </button>
            {!uploaded2 && <div className="loader-line"></div>}
          </div>
        </div>
        <div className="sec sec3">
          {responseDuration !== "" && (
            <div className="response duration">
              took <span>{responseDuration}</span> ms
            </div>
          )}
          {responseTime !== "" && (
            <div className="response time">{responseTime}</div>
          )}

          <pre>{jsonResponse}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;

const checkToken = () => {
  let expiryTime = getDataFromJWT(
    localStorage.getItem("accessToken:ehsan")
  )?.exp;

  let now = new Date().getTime() / 1000;
  if (now > expiryTime) return false;
  return true;
};

function getDataFromJWT(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");

  return JSON.parse(window.atob(base64));
}
