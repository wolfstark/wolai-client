function addStylesheetRules(rules) {
  const styleEl = document.createElement("style");

  document.head.appendChild(styleEl);

  const styleSheet = styleEl.sheet;

  const selectors = Object.keys(rules);

  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const rule = rules[selector];
    const props = Object.keys(rule);
    let propStr = "";

    for (let j = 0; j < props.length; j++) {
      const prop = props[j];
      propStr += `${prop}: ${rule[prop]};\n`;
    }

    styleSheet.insertRule(
      `${selector}{${propStr}}`,
      styleSheet.cssRules.length
    );
  }
}

addStylesheetRules({
  "._3S0Sh": {
    transform: "none",
  },
  ".modal-dialog-wrapper.text-action-bar-wrapper": {
    position: "absolute !important",
  },
  ".modal-dialog-wrapper.text-action-bar-wrapper > div": {
    position: "absolute !important",
  },
  ":root": {
    "--wolai-editor-color": "rgb(59, 69, 78)",
    "--wolai-caret-color": "#3b454e",
    "--wolai-link-node-color": "#cf5659",
    "--wolai-link-node-hover-color": "#c15b50",
    "--wolai-header-page-title-color": "rgb(55, 53, 47)",
    "--wolai-workspace-name-color": "rgb(55, 53, 47)",
    "--wolai-sidebar-bg": "rgb(247, 246, 243)",
    "--wolai-bg": "rgb(252, 249, 245)",
    "--wolai-editor-bg": "rgb(252, 249, 245)",
  },
  "._2VNwp": {
    "line-height": "1.625",
  },
  '.content-wrapper[data-block-type="text"]': {
    padding: "8px 2px",
  },

  "html body": {
    background: "rgb(252, 249, 245) !important",
  },

  'html[theme="dark"] body': {
    background: "#252528 !important",
  },

  /* 编辑区icon */
  "._3DZG7 path, ._3-gMw path": {
    fill: "currentcolor",
    color: "rgba(55, 53, 47, 0.8)",
  },

  'html[theme="dark"] ._3DZG7 path,html[theme="dark"] ._3-gMw path': {
    color: "inherit",
  },

  /* 侧边栏 空间*/
  "._3aHCs .xANBS": {
    "font-weight": 500,
  },

  "._3aHCs .yMHfV": {
    width: "20px",
    height: "20px",
  },

  ".gJqt_": {
    "--wolai-svg-icon-312727": "rgba(55, 53, 47, 0.4)",
    "--wolai-title-color": "rgba(25, 23, 17, 0.6)",
  },

  'html[theme="dark"] .gJqt_': {
    "--wolai-svg-icon-312727": "inherit",
    "--wolai-title-color": "inherit",
  },
  //   Mac左上角控制条
  ".gJqt_::before": {
    content: "''",
    height: "26px",
    "-webkit-app-region": "drag",
  },
  ".gJqt_._3sa-7::before": {
    height: "0",
  },
  "._3xxlZ": {
    "-webkit-app-region": "drag",
  },
  ".cEs8w._3sa-7 ~ ._3G4KQ ._3xxlZ": {
    "padding-left": "71px",
  },
});
