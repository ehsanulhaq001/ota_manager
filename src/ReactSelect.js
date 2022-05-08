import React from "react";
import Select from "react-select";

const ReactSelect = ({ opts, def, handleChange, them, vw }) => {
  const colourOptions = opts.map((opt) => {
    return { value: opt, label: opt, color: "red" };
  });

  const groupedOptions = [
    {
      label: "",
      options: colourOptions,
    },
  ];

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const groupBadgeStyles = {
    // backgroundColor: them ? "#ffffff11" : "#00000011",
    borderRadius: vw * 0.3,
    color: "#16a085",
    display: "inline-block",
    fontSize: vw,
    padding: "0.2vw 0.5vw",
    textAlign: "center",
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? (them ? "#00c3ff" : "#8676ff") : "#16a085",
    }),
    noOptionsMessage: (provided, state) => ({
      ...provided,
      color: "orange",
      backgroundColor: them ? "#0c111a" : "white",
    }),
    groupHeading: (provided) => ({
      ...provided,
      color: them ? "#00c3ff" : "#8676ff",
      fontSize: vw,
    }),
    group: (provided) => ({
      ...provided,
      backgroundColor: them ? "#2a303c" : "white",
    }),
    container: (provided) => ({
      ...provided,
      color: "pink",
      backgroundColor: them ? "#ffffff11" : "#00000011",
      borderRadius: vw * 0.3,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: them ? "#ffffff77" : "#00000077",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: them ? "#ffffff77" : "#00000077",
    }),

    loadingIndicator: (provided) => ({
      ...provided,
      color: "lime",
      backgroundColor: "lime",
    }),
  };

  return (
    <Select
      styles={customStyles}
      defaultValue={def}
      options={groupedOptions}
      formatGroupLabel={formatGroupLabel}
      onChange={handleChange}
      theme={(theme) => ({
        ...theme,
        borderRadius: vw * 0.3,
        colors: {
          ...theme.colors,
          neutral0: "#2a303c",
          // neutral10: 'red',
          neutral20: "#ffffff00", // border
          // neutral30: 'red', // border hover
          // neutral40: 'red',
          // neutral50: 'red',
          // neutral60: 'red', // arrow
          // neutral70: 'red',
          neutral80: "var(--c4)", // value
          // neutral90: 'red',

          primary: them ? "#ffffff11" : "#00000011", //selected
          primary25: them ? "#ffffff11" : "#00000011", // hover
          primary50: them ? "#ffffff44" : "#00000044", //active
          // primary75: 'pink',
        },
      })}
    />
  );
};

export default ReactSelect;
