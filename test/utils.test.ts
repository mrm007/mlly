import { describe, it, expect } from "vitest";
import { isNodeBuiltin, sanitizeFilePath, getProtocol } from "../src";

describe("isNodeBuiltin", () => {
  const cases = {
    fs: true,
    fake: false,
    "node:fs": true,
    "node:fake": false,
    "fs/promises": true,
    "fs/fake": true, // invalid import
  };

  for (const id in cases) {
    it(`'${id}': ${cases[id]}`, () => {
      expect(isNodeBuiltin(id)).to.equal(cases[id]);
    });
  }

  it("undefined", () => {
    expect(isNodeBuiltin()).to.equal(false);
  });
});

describe("sanitizeFilePath", () => {
  const cases = {
    "C:/te#st/[...slug].jsx": "C:/te_st/_...slug_.jsx",
    "C:\\te#st\\[...slug].jsx": "C:/te_st/_...slug_.jsx",
    "/te#st/[...slug].jsx": "/te_st/_...slug_.jsx",
    "/te#st/[].jsx": "/te_st/_.jsx",
    '\0a?b*c:d\u007Fe<f>g#h"i{j}k|l^m[n]o`p.jsx':
      "_a_b_c_d_e_f_g_h_i_j_k_l_m_n_o_p.jsx",
    "": "",
  };
  for (const id in cases) {
    it(`'${id}': ${cases[id]}`, () => {
      expect(sanitizeFilePath(id)).to.equal(cases[id]);
    });
  }

  it("undefined", () => {
    expect(sanitizeFilePath()).to.equal("");
  });
});

describe("getProtocol", () => {
  it("no protocol", () => {
    expect(getProtocol("/src/a.ts")).to.equal(undefined);
    expect(getProtocol("C:/src/a.ts")).to.equal(undefined);
  });

  it("file protocol", () => {
    expect(getProtocol("file://src/a.ts")).to.equal("file");
    expect(getProtocol("file://C:/src/a.ts")).to.equal("file");
    expect(getProtocol("file:///C:/src/a.ts")).to.equal("file");
  });
});
