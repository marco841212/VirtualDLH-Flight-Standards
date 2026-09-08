import React from "react";

import {
  usePluginContext
} from "@skyvexsoftware/stratos-sdk";

import "./styles.css";


export default function VirtualDLHFlightStandards() {

  const {
    pluginId
  } = usePluginContext();


  return React.createElement(
    "main",
    {
      className: "vdlh-standards"
    },

    React.createElement(
      "section",
      {
        className: "vdlh-standards__card"
      },

      React.createElement(
        "div",
        {
          className: "vdlh-standards__eyebrow"
        },
        "VirtualDLH"
      ),

      React.createElement(
        "h1",
        null,
        "Flight Standards"
      ),

      React.createElement(
        "p",
        {
          className: "vdlh-standards__copy"
        },
        "Cockpit procedure monitoring, SOP scoring, FOQA exceedance detection, and pilot performance reporting for Stratos flights."
      ),

      React.createElement(
        "div",
        {
          className: "vdlh-standards__status"
        },

        React.createElement(
          "span",
          {
            className: "vdlh-standards__dot",
            "aria-hidden": "true"
          }
        ),

        React.createElement(
          "span",
          null,
          "Background monitoring service loaded"
        )
      ),

      React.createElement(
        "p",
        {
          className: "vdlh-standards__plugin-id"
        },
        `Plugin ID: ${pluginId}`
      )

    )
  );

}
