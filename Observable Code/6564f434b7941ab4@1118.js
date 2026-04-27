import define1 from "./b2bbebd2f186ed03@1846.js";
import define2 from "./1552f11722bec435@849.js";

function _1(md){return(
md`# NHS ICD 10 Primary Diagnosis: 3 Character Code from 2013 to 2022 - Brushable parallel coordinates`
)}

function _2(md){return(
md`## Filters`
)}

function _seleectedGender(Inputs){return(
Inputs.select(["Male", "Female"], {multiple: true, label: "Gender", width: 700})
)}

function _selectedICD10Chapters(Inputs,icd10Chpaters){return(
Inputs.select(icd10Chpaters, {multiple: true, label: "ICD10 Chapters", width: 700})
)}

function _selectedICD10Codes(Inputs,icd10Codes){return(
Inputs.select(icd10Codes, {multiple: true, label: "ICD10 Codes", width: 700})
)}

function _cagrRange(interval){return(
interval([-100, 10000], {
  step: 1,
  value: [-100, 10000],
  label: 'CAGR %',
  width: 1000
})
)}

function _avg_3yr_growthRate(interval){return(
interval([-100, 10000], {
  step: 1,
  value: [-100, 10000],
  label: '3 Year Average Admission Growth Rate (%)',
  width: 1000
})
)}

function _ageRange(interval){return(
interval([0, 100], {
  step: 1,
  value: [0, 100],
  label: 'Mean Age',
  width: 500
})
)}

function _admissionsRange(interval){return(
interval([0, 350000], {
  step: 500,
  value: [0, 350000],
  label: 'Admissions',
  width: 1000
})
)}

function _admissionRatePerCapita(interval){return(
interval([0, 10000], {
  step: 1,
  value: [0, 100000],
  label: 'Admission Rate per 100,000 persons',
  width: 1000
})
)}

function _changeAdmissiionRatePerCapita(interval){return(
interval([-5000, 20000], {
  step: 10,
  value: [-5000, 20000],
  label: '% Change in Admission Rate per 100,000 persons',
  width: 1000
})
)}

function _trueSurgeIndexNormalized(interval){return(
interval([0, 1], {
  step: 0.1,
  value: [0, 1],
  label: 'True Surge Index (Symmetrical Logrithm Normalized Scale)',
  width: 1000
})
)}

function _trueSurgeIndex(interval){return(
interval([-5002, 20000], {
  step: 1,
  value: [-5002, 20000],
  label: 'True Surge Index',
  width: 1000
})
)}

function _yearRange(interval){return(
interval([2013, 2022], {
  step: 1,
  value: [2013, 2022],
  label: 'Year',
  width: 500
})
)}

function _keyz(html,keys2)
{
  const form = html`<form><i>Color Encoding</i><br>${Object.assign(html`<select name=select>${keys2.map(key => Object.assign(html`<option>`, {value: key, textContent: key}))}</select>`,{value: "True Surge Index (SymLog Normalized)"})} `;
  form.select.onchange = () => (form.value = form.select.value, form.dispatchEvent(new CustomEvent("input")));
  form.select.onchange();
  return form;
}


function _legend(Legend,$0,keyz,formatLegendTicks){return(
Legend({
  color: ($0).scales.color, 
  title: keyz,
  tickFormat: formatLegendTicks(keyz)
},)
)}

function _selection(d3,keys2,data,keyz,wrapTickLabel,columns2)
{
  
  console.log(window.innerHeight);
  console.log(window.innerWidth);
  
  const wrapper = d3.create("div")
      .style("position", "relative")
      .style("background", "black") 
      .style("width", "100%")
      .style("height", "100%");

  const btn = wrapper.append("button")
      .html("⛶ Fullscreen")
      .style("position", "relative")
      .style("top", "10px")
      .style("right", "10px")
      .style("padding", "5px 10px")
      .style("cursor", "pointer")
      .style("z-index", 1000)
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px");
  
  const width = Math.max(window.innerWidth, keys2.length * 240); 
  const height = Math.min(window.innerHeight, 1440); 
  const marginTop = 120; 
  const marginRight = 80;
  const marginBottom = 50;
  const marginLeft = 80;

  const isCategorical = (key) => {
    const validRow = data.find(d => d[key] != null);
    return validRow && typeof validRow[key] === "string";
  };

  const x = d3.scalePoint(keys2, [marginLeft, width - marginRight]);

  const yOrig = new Map(Array.from(keys2, key => {
    if (isCategorical(key)) {
      const domain = Array.from(new Set(data.map(d => d[key]).filter(d => d != null))).sort();
      return [key, d3.scalePoint(domain, [height - marginBottom, marginTop]).padding(0.1)];
    } else {
      return [key, d3.scaleLinear(d3.extent(data, d => d[key]), [height - marginBottom, marginTop])];
    }
  }));
  
  const y = new Map(Array.from(yOrig.entries()));
  
  const keyzScale = y.get(keyz);
  let color;
  if (isCategorical(keyz)) {
    color = d3.scaleOrdinal(keyzScale.domain(), d3.schemeTableau10);
  } else {
    color = d3.scaleSequential(keyzScale.domain(), t => d3.interpolateWarm(1 - t));
  }

  const svg = wrapper.append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: 90%; display: block; margin: 0 auto;");
      // .attr("style", "max-width: 100%; height: auto; display: block;");

  // Append the lines.
  const line = d3.line()
    .defined(([, value]) => value != null)
    .x(([key]) => x(key)) 
    .y(([key, value]) => y.get(key)(value)); 

  const DEFAULT_WIDTH = 2;
  const DEFAULT_OPACITY = 0.7;
  const FULL_OPACITY = 1.0;
  
  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", DEFAULT_OPACITY)
    .selectAll("path")
    .data(data.slice().sort((a, b) => {
      if (isCategorical(keyz)) return d3.ascending(a[keyz], b[keyz]);
      return a[keyz] - b[keyz];
    }))
    .join("path")
      .attr("stroke", d => color(d[keyz]))
      .attr("d", d => line(d3.cross(keys2, [d], (key, d) => [key, d[key]])));

  const axes = svg.append("g")
    .selectAll("g")
    .data(keys2)
    .join("g")
      .attr("transform", d => `translate(${x(d)},0)`) 
      .each(function(d) { 
        const axisGenerator = d3.axisLeft(y.get(d));
        if (d === "Year") {
          axisGenerator.tickFormat(d3.format("d"));
        }
        
        const axisGroup = d3.select(this).append("g")
          .attr("class", "axis-graphics")
          .attr("color", "white") 
          .call(axisGenerator); 
          
        if (d === "ICD-10 Chapter") {
           axisGroup.selectAll(".tick text")
             .call(wrapTickLabel, 120); 
        }
      })
    .call(g => g.selectAll("line").style("stroke", "white"))
    .call(g => g.selectAll("path").style("stroke", "white"))
        .call(g => g.selectAll("text")
        .style("font-size", "1rem")
        .attr("fill", "white")
        .clone(true).lower()
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke", "black"))
        .call(g => g.append("foreignObject")
          .attr("width", 110) 
          .attr("x", -55) 
          .attr("y", 0)
          .attr("height", marginTop - 10) 
          .append("xhtml:div")
          .style("width", "100%")
          .style("height", "100%")
          .style("display", "flex")
          .style("align-items", "flex-end")
          .style("justify-content", "center") 
          .style("text-align", "center")
          .style("font-size", "1rem") 
          .style("font-weight", "600")
          .style("line-height", "1.2")
          .style("color", "white")
          .text(d => d)
        );

  const zoom = d3.zoom()
      .scaleExtent([1, 50]) 
      .translateExtent([[-Infinity, marginTop], [Infinity, height - marginBottom]])
      .filter(event => {
        if (event.type === "wheel") return true;
        if (event.type === "mousedown") return event.shiftKey && event.button === 0;
        return false;
      })
      .on("zoom", function(event, key) {
        if (yOrig.get(key).invert) {
            const newScale = event.transform.rescaleY(yOrig.get(key));
            y.set(key, newScale);
            d3.select(this).select(".axis-graphics").call(d3.axisLeft(newScale));
            path.attr("d", d => line(d3.cross(keys2, [d], (key, d) => [key, d[key]])));
        }
      });

  axes.call(zoom);

  const deselectedColor = "#444";
  const brushWidth = 50; 
  const brush = d3.brushY() 
      .extent([
        [-(brushWidth / 2), marginTop],
        [brushWidth / 2, height - marginBottom]
      ])
      .filter(event => !event.ctrlKey && !event.button && !event.shiftKey)
      .on("start brush end", brushed);

  axes.call(brush);

  const selections = new Map();

  function brushed({selection}, key) {
    if (selection === null) {
      selections.delete(key);
    } else {
      const scale = y.get(key);
      if (scale.invert) {
        // Numeric mapping
        const invertedRange = selection.map(scale.invert).sort((a, b) => a - b);
        selections.set(key, { type: 'numeric', range: invertedRange });
      } else {
        const [y0, y1] = selection;
        const selectedDomain = scale.domain().filter(d => {
            const pos = scale(d);
            return pos >= y0 && pos <= y1;
        });
        selections.set(key, { type: 'categorical', range: selectedDomain });
      }
    }
    
    const selected = [];
    path.each(function(d) {
      const active = Array.from(selections).every(([key, data]) => {
        if (d[key] == null) return false;
        if (data.type === 'numeric') {
            return d[key] >= data.range[0] && d[key] <= data.range[1];
        } else {
            return data.range.includes(d[key]);
        }
      });
      d3.select(this).style("stroke", active ? color(d[keyz]) : deselectedColor).style("opacity", active ? FULL_OPACITY : 0.5);
      if (active) {
        d3.select(this).raise();
        selected.push(d);
      }
    });
    wrapper.property("value", selected).dispatch("input");
  }

  const metaColumns = columns2.filter(col => !keys2.includes(col));
  const defaultStatusText = "<span style='color:#999; font-style:italic;'>Hover over a line to view details, click to pin it...</span>";
  const statusBar = wrapper.append("div")
      .style("width", "100%")
      .style("box-sizing", "border-box")
      .style("padding", "10px 15px")
      .style("background", "#1a1a1a")
      .style("color", "#fff")
      .style("font-size", "0.95rem")
      .style("display", "flex")
      .style("flex-direction", "column") 
      .style("gap", "6px")
      .style("overflow-y", "auto") 
      .style("max-height", "180px") 
      .html(defaultStatusText);

  let pinnedLines = [];

  const smartFormat = (key, val) => {
    if (typeof val !== "number") return val; 
    if (key === "Year" || key.toLowerCase().includes("year")) return val;
    if (Number.isInteger(val)) return d3.format(",")(val);
    const isPercent = key.toLowerCase().includes("pct") || key.toLowerCase().includes("cagr") || key.toLowerCase().includes("surge");
    let formattedNum = (Math.abs(val) > 0 && Math.abs(val) < 0.01) ? d3.format(".4f")(val) : d3.format(",.2f")(val);
    return isPercent ? `${formattedNum}%` : formattedNum;
  };

  const renderStatusBar = (hoveredD = null) => {
    const linesToRender = [...pinnedLines];
    if (hoveredD && !pinnedLines.includes(hoveredD)) {
      linesToRender.push(hoveredD);
    }

    if (linesToRender.length === 0) {
      statusBar.html(defaultStatusText);
      return;
    }

    const formatItem = (label, val) => `<div style="display:flex; gap:5px; white-space:nowrap;"><span style="color:#aaa;">${label}:</span><span style="font-weight:600;">${smartFormat(label, val)}</span></div>`;

    const htmlRows = linesToRender.map(d => {
      const isPinned = pinnedLines.includes(d);
      const lineColor = color(d[keyz]);
      
      const metaItems = metaColumns.filter(col => d[col] != null && d[col] !== "").map(col => formatItem(col, d[col]));
      const axisItems = keys2.filter(key => d[key] != null).map(key => formatItem(key, d[key]));

      return `
        <div style="display:flex; flex-wrap:wrap; column-gap:20px; row-gap:4px; padding-bottom:4px; border-bottom:1px solid #333; align-items:center;">
          ${metaItems.join("")}
          ${axisItems.join("")}
        </div>
      `;
    });

    statusBar.html(htmlRows.join(""));
  };

  const isBrushed = (d) => {
    if (selections.size === 0) return true;
    return Array.from(selections).every(([key, data]) => {
      if (d[key] == null) return false;
      if (data.type === 'numeric') return d[key] >= data.range[0] && d[key] <= data.range[1];
      return data.range.includes(d[key]);
    });
  };

  const updateLineVisuals = (hoveredD = null) => {
    path.each(function(d) {
      const active = isBrushed(d);
      const isPinned = pinnedLines.includes(d);
      const isHovered = (d === hoveredD);

      let strokeOpacity, strokeWidth;
      
      if (!active) {
        strokeOpacity = 0.6; strokeWidth = 2; 
      } else if (pinnedLines.length === 0) {
        strokeOpacity = isHovered ? 1 : DEFAULT_OPACITY;
        strokeWidth = isHovered ? 3 : DEFAULT_WIDTH;
      } else {
        if (isPinned || isHovered) {
          strokeOpacity = FULL_OPACITY; 
          strokeWidth = isPinned ? 4 : 3; 
        } else {
          strokeOpacity = 0.5; 
          strokeWidth = 2;
        }
      }

      const node = d3.select(this)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-width", strokeWidth);
        
      if (isPinned || isHovered) node.raise();
    });
  };

  path
    .on("mouseover", function(event, d) {
      if (!isBrushed(d)) return;
      updateLineVisuals(d);
      renderStatusBar(d);
    })
    .on("mouseout", function(event, d) {
      updateLineVisuals(null);
      renderStatusBar(null);
    })
    .on("click", function(event, d) {
      event.stopPropagation(); 
      if (!isBrushed(d)) return;

      if (pinnedLines.includes(d)) {
        pinnedLines = pinnedLines.filter(p => p !== d); 
      } else {
        pinnedLines.push(d);
      }
      
      updateLineVisuals(d); 
      renderStatusBar(d);
    });

  svg.on("click", () => {
    if (pinnedLines.length > 0) {
      pinnedLines = [];
      updateLineVisuals(null);
      renderStatusBar(null);
    }
  });

  btn.on("click", () => {
    const node = wrapper.node();
    if (!document.fullscreenElement) {
      node.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === wrapper.node()) {
      btn.html("✖ Exit Fullscreen");
      wrapper.style("height", "100vh").style("max-width", "none");
      
      svg.style("max-height", "calc(100vh - 120px)"); 
      
      statusBar.style("margin-top", "auto");
    } else {
      btn.html("⛶ Fullscreen");
      wrapper.style("height", "auto").style("max-width", `${width}px`);
      svg.style("max-height", "none");
      statusBar.style("margin-top", "0");
    }
  });

  return Object.assign(wrapper.property("value", data).node(), {scales: {color}});
}


function _18(md){return(
md`## Data`
)}

function _cagr(FileAttachment){return(
FileAttachment("2013-2022_DiagnosisGenderCAGRAnalysis_Df_2026-04-24.csv").csv({typed: true})
)}

function _icd10Chpaters(){return(
[
"Abnormal Clinical & Laboratory Findings",
"Blood, Blood-Forming Organs, & Immune System",
"Circulatory System",
"Codes For Special Purposes",
"Congenital & Chromosomal Abnormalities",
"Digestive System",
"Ear & Mastoid Process",
"Endocrine, Nutritional & Metabolic Diseases",
"Eye & Adnexa",
"Genitourinary System",
"Health Status & Contact With Health Services",
"Infectious & Parasitic Diseases",
"Injury, Poisoning & Other External Causes",
"Mental & Behavioural Disorders",
"Musculoskeletal System & Connective Tissue",
"Neoplasms",
"Nervous System",
"Pregnancy, Childbirth & The Puerperium",
"Respiratory System",
"Skin & Subcutaneous Tissue",
"Perinatal Period"
]
)}

function _data(cagr,cagrRange,ageRange,avg_3yr_growthRate,admissionsRange,admissionRatePerCapita,changeAdmissiionRatePerCapita,trueSurgeIndexNormalized,trueSurgeIndex,yearRange,seleectedGender,selectedICD10Chapters,selectedICD10Codes){return(
cagr.filter(d =>
  d["5-Yr CAGR(%) in Admission Rate/100,000"] >= cagrRange[0] 
  && d["5-Yr CAGR(%) in Admission Rate/100,000"] <= cagrRange[1] 
  && d["Mean age"] >= ageRange[0] 
  && d["Mean age"] <= ageRange[1] 
  && d["3-Yr Average Annual Change in Admission Rate/100,000"] >= avg_3yr_growthRate[0] 
  && d["3-Yr Average Annual Change in Admission Rate/100,000"] <= avg_3yr_growthRate[1] 
  && d["Admissions"] >= admissionsRange[0] 
  && d["Admissions"] <= admissionsRange[1] 
  && d["Admission Rate/100,000"] >= admissionRatePerCapita[0] 
  && d["Admission Rate/100,000"] <= admissionRatePerCapita[1] 
  && d["APC in Admission Rate/100,000"] >= changeAdmissiionRatePerCapita[0] 
  && d["APC in Admission Rate/100,000"] <= changeAdmissiionRatePerCapita[1] 
  && d["True Surge Index (SymLog Normalized)"] >= trueSurgeIndexNormalized[0] 
  && d["True Surge Index (SymLog Normalized)"] <= trueSurgeIndexNormalized[1] 
  && d["True Surge Index"] >= trueSurgeIndex[0] 
  && d["True Surge Index"] <= trueSurgeIndex[1] 
  && d["Year"] >= yearRange[0] 
  && d["Year"] <= yearRange[1]
  && (seleectedGender.length === 0 ||
  seleectedGender.includes(d["Gender"]))
  && (selectedICD10Chapters.length === 0 ||
  selectedICD10Chapters.includes(d["ICD-10 Chapter"]))
  && (selectedICD10Codes.length === 0 ||
  selectedICD10Codes.includes(d["Primary Diagnosis Code"]))
)
)}

function _23(__query,FileAttachment,invalidation){return(
__query(FileAttachment("2013-2022_DiagnosisGenderCAGRAnalysis_Df_2026-04-24.csv"),{from:{table:"2013-2022_DiagnosisGenderCAGRAnalysis_Df_2026-04-24"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _24(cagr){return(
cagr.columns.slice(1)
)}

function _columns2(){return(
["Year", "Primary Diagnosis: 3 character code and description", "Description", "Mean age", "Finished Consultant Episodes", "Gender", "Admissions", "Admissions1", "Rate Per 100k", "Prev Rate Per 100k", "Rate YoY Growth Pct", "Pop YoY Growth Pct", "True Surge Index", "Avg YoY Rate Growth 3 Yr", "CAGR %"]
)}

function _numericDims(){return(
[
// "Year",
// "ICD10 Chapter Code",
// "ICD10 Code Mapping",
"Finished Consultant Episodes",
"Admissions",
// "Population",
// "ICD10 Chapter Code1",
// "ICD10 Code Mapping1",
// "Finished Consultant Episodes1",
// "Admissions1",
// "Population1",
// "Gender Code",
"Mean age", 
"Admission Rate/100,000",
// "Mean age1",
// "Prev Rate Per 100k",
"APC in Admission Rate/100,000",
// "Pop YoY Growth Pct",
"True Surge Index",
// "True Surge Index SymLog",
"True Surge Index (SymLog Normalized)"
]
)}

function _categoricalDims(){return(
[
  "Year",
  "ICD-10 Chapter",
  // "ICD10 Code",
  // "Description",
  // "Gender",
  // "ICD10 Chapter1",
  // "Primary Diagnosis: 3 character code and description1"
]
)}

function _keys2(){return(
[
  "Year", 
  "ICD-10 Chapter", 
  // "Gender", 
  "Mean age",  
  "Admissions", 
  "Admission Rate/100,000", 
  "APC in Admission Rate/100,000", 
  "True Surge Index",
  "True Surge Index (SymLog Normalized)", 
  "3-Yr Average Annual Change in Admission Rate/100,000", 
  "5-Yr CAGR(%) in Admission Rate/100,000"]
)}

function _icd10Codes(){return(
["A00", "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A15", "A16", "A17", "A18", "A19", "A20", "A21", "A22", "A23", "A24", "A25", "A26", "A27", "A28", "A30", "A31", "A32", "A33", "A34", "A35", "A36", "A37", "A38", "A39", "A40", "A41", "A42", "A43", "A44", "A46", "A48", "A49", "A50", "A51", "A52", "A53", "A54", "A55", "A56", "A57", "A58", "A59", "A60", "A63", "A64", "A65", "A66", "A67", "A68", "A69", "A70", "A71", "A74", "A75", "A77", "A78", "A79", "A80", "A81", "A82", "A83", "A84", "A85", "A86", "A87", "A88", "A89", "A90", "A91", "A92", "A93", "A94", "A95", "A96", "A97", "A98", "A99", "B00", "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B15", "B16", "B17", "B18", "B19", "B20", "B21", "B22", "B23", "B24", "B25", "B26", "B27", "B30", "B33", "B34", "B35", "B36", "B37", "B38", "B39", "B40", "B41", "B42", "B43", "B44", "B45", "B46", "B47", "B48", "B49", "B50", "B51", "B52", "B53", "B54", "B55", "B56", "B57", "B58", "B59", "B60", "B64", "B65", "B66", "B67", "B68", "B69", "B70", "B71", "B72", "B73", "B74", "B75", "B76", "B77", "B78", "B79", "B80", "B81", "B82", "B83", "B85", "B86", "B87", "B88", "B89", "B90", "B91", "B94", "B95", "B96", "B97", "B98", "B99", "C00", "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13", "C14", "C15", "C16", "C17", "C18", "C19", "C20", "C21", "C22", "C23", "C24", "C25", "C26", "C30", "C31", "C32", "C33", "C34", "C37", "C38", "C39", "C40", "C41", "C43", "C44", "C45", "C46", "C47", "C48", "C49", "C50", "C51", "C52", "C53", "C54", "C55", "C56", "C57", "C58", "C60", "C61", "C62", "C63", "C64", "C65", "C66", "C67", "C68", "C69", "C70", "C71", "C72", "C73", "C74", "C75", "C76", "C77", "C78", "C79", "C80", "C81", "C82", "C83", "C84", "C85", "C86", "C88", "C90", "C91", "C92", "C93", "C94", "C95", "C96", "C97", "D00", "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D09", "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19", "D20", "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29", "D30", "D31", "D32", "D33", "D34", "D35", "D36", "D37", "D38", "D39", "D40", "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48", "D50", "D51", "D52", "D53", "D55", "D56", "D57", "D58", "D59", "D60", "D61", "D62", "D63", "D64", "D65", "D66", "D67", "D68", "D69", "D70", "D71", "D72", "D73", "D74", "D75", "D76", "D77", "D80", "D81", "D82", "D83", "D84", "D86", "D89", "E00", "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E20", "E21", "E22", "E23", "E24", "E25", "E26", "E27", "E28", "E29", "E30", "E31", "E32", "E34", "E35", "E40", "E41", "E42", "E43", "E44", "E45", "E46", "E50", "E51", "E52", "E53", "E54", "E55", "E56", "E58", "E59", "E60", "E61", "E63", "E64", "E65", "E66", "E67", "E68", "E70", "E71", "E72", "E73", "E74", "E75", "E76", "E77", "E78", "E79", "E80", "E83", "E84", "E85", "E86", "E87", "E88", "E89", "E90", "F00", "F01", "F02", "F03", "F04", "F05", "F06", "F07", "F09", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "F25", "F28", "F29", "F30", "F31", "F32", "F33", "F34", "F38", "F39", "F40", "F41", "F42", "F43", "F44", "F45", "F48", "F50", "F51", "F52", "F53", "F54", "F55", "F59", "F60", "F61", "F62", "F63", "F64", "F65", "F66", "F68", "F69", "F70", "F71", "F72", "F73", "F78", "F79", "F80", "F81", "F82", "F83", "F84", "F88", "F89", "F90", "F91", "F92", "F93", "F94", "F95", "F98", "F99", "G00", "G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10", "G11", "G12", "G13", "G14", "G20", "G21", "G22", "G23", "G24", "G25", "G26", "G30", "G31", "G32", "G35", "G36", "G37", "G40", "G41", "G43", "G44", "G45", "G46", "G47", "G50", "G51", "G52", "G53", "G54", "G55", "G56", "G57", "G58", "G59", "G60", "G61", "G62", "G63", "G64", "G70", "G71", "G72", "G73", "G80", "G81", "G82", "G83", "G90", "G91", "G92", "G93", "G94", "G95", "G96", "G97", "G98", "G99", "H00", "H01", "H02", "H03", "H04", "H05", "H06", "H10", "H11", "H13", "H15", "H16", "H17", "H18", "H19", "H20", "H21", "H22", "H25", "H26", "H27", "H28", "H30", "H31", "H32", "H33", "H34", "H35", "H36", "H40", "H42", "H43", "H44", "H45", "H46", "H47", "H48", "H49", "H50", "H51", "H52", "H53", "H54", "H55", "H57", "H58", "H59", "H60", "H61", "H62", "H65", "H66", "H67", "H68", "H69", "H70", "H71", "H72", "H73", "H74", "H75", "H80", "H81", "H82", "H83", "H90", "H91", "H92", "H93", "H94", "H95", "I00", "I01", "I02", "I05", "I06", "I07", "I08", "I09", "I10", "I11", "I12", "I13", "I15", "I20", "I21", "I22", "I23", "I24", "I25", "I26", "I27", "I28", "I30", "I31", "I32", "I33", "I34", "I35", "I36", "I37", "I38", "I39", "I40", "I41", "I42", "I43", "I44", "I45", "I46", "I47", "I48", "I49", "I50", "I51", "I52", "I60", "I61", "I62", "I63", "I64", "I65", "I66", "I67", "I68", "I69", "I70", "I71", "I72", "I73", "I74", "I77", "I78", "I79", "I80", "I81", "I82", "I83", "I84", "I85", "I86", "I87", "I88", "I89", "I95", "I97", "I98", "I99", "J00", "J01", "J02", "J03", "J04", "J05", "J06", "J09", "J10", "J11", "J12", "J13", "J14", "J15", "J16", "J17", "J18", "J20", "J21", "J22", "J30", "J31", "J32", "J33", "J34", "J35", "J36", "J37", "J38", "J39", "J40", "J41", "J42", "J43", "J44", "J45", "J46", "J47", "J60", "J61", "J62", "J63", "J64", "J65", "J66", "J67", "J68", "J69", "J70", "J80", "J81", "J82", "J84", "J85", "J86", "J90", "J91", "J92", "J93", "J94", "J95", "J96", "J98", "J99", "K00", "K01", "K02", "K03", "K04", "K05", "K06", "K07", "K08", "K09", "K10", "K11", "K12", "K13", "K14", "K20", "K21", "K22", "K23", "K25", "K26", "K27", "K28", "K29", "K30", "K31", "K35", "K36", "K37", "K38", "K40", "K41", "K42", "K43", "K44", "K45", "K46", "K50", "K51", "K52", "K55", "K56", "K57", "K58", "K59", "K60", "K61", "K62", "K63", "K64", "K65", "K66", "K67", "K70", "K71", "K72", "K73", "K74", "K75", "K76", "K77", "K80", "K81", "K82", "K83", "K85", "K86", "K87", "K90", "K91", "K92", "K93", "L00", "L01", "L02", "L03", "L04", "L05", "L08", "L10", "L11", "L12", "L13", "L14", "L20", "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L40", "L41", "L42", "L43", "L44", "L45", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58", "L59", "L60", "L62", "L63", "L64", "L65", "L66", "L67", "L68", "L70", "L71", "L72", "L73", "L74", "L75", "L80", "L81", "L82", "L83", "L84", "L85", "L86", "L87", "L88", "L89", "L90", "L91", "L92", "L93", "L94", "L95", "L97", "L98", "L99", "M00", "M01", "M02", "M03", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18", "M19", "M20", "M21", "M22", "M23", "M24", "M25", "M30", "M31", "M32", "M33", "M34", "M35", "M36", "M40", "M41", "M42", "M43", "M45", "M46", "M47", "M48", "M49", "M50", "M51", "M53", "M54", "M60", "M61", "M62", "M63", "M65", "M66", "M67", "M68", "M70", "M71", "M72", "M73", "M75", "M76", "M77", "M79", "M80", "M81", "M82", "M83", "M84", "M85", "M86", "M87", "M88", "M89", "M90", "M91", "M92", "M93", "M94", "M95", "M96", "M99", "N00", "N01", "N02", "N03", "N04", "N05", "N06", "N07", "N08", "N10", "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20", "N21", "N22", "N23", "N25", "N26", "N27", "N28", "N29", "N30", "N31", "N32", "N33", "N34", "N35", "N36", "N37", "N39", "N40", "N41", "N42", "N43", "N44", "N45", "N46", "N47", "N48", "N49", "N50", "N51", "N60", "N61", "N62", "N63", "N64", "N70", "N71", "N72", "N73", "N74", "N75", "N76", "N77", "N80", "N81", "N82", "N83", "N84", "N85", "N86", "N87", "N88", "N89", "N90", "N91", "N92", "N93", "N94", "N95", "N96", "N97", "N98", "N99", "O00", "O01", "O02", "O03", "O04", "O05", "O06", "O07", "O08", "O10", "O11", "O12", "O13", "O14", "O15", "O16", "O20", "O21", "O22", "O23", "O24", "O25", "O26", "O28", "O29", "O30", "O31", "O32", "O33", "O34", "O35", "O36", "O40", "O41", "O42", "O43", "O44", "O45", "O46", "O47", "O48", "O60", "O61", "O62", "O63", "O64", "O65", "O66", "O67", "O68", "O69", "O70", "O71", "O72", "O73", "O74", "O75", "O80", "O81", "O82", "O83", "O84", "O85", "O86", "O87", "O88", "O89", "O90", "O91", "O92", "O94", "O95", "O96", "O98", "O99", "P00", "P01", "P02", "P03", "P04", "P05", "P07", "P08", "P10", "P11", "P12", "P13", "P14", "P15", "P20", "P21", "P22", "P23", "P24", "P25", "P26", "P27", "P28", "P29", "P35", "P36", "P37", "P38", "P39", "P50", "P51", "P52", "P53", "P54", "P55", "P56", "P57", "P58", "P59", "P60", "P61", "P70", "P71", "P72", "P74", "P75", "P76", "P77", "P78", "P80", "P81", "P83", "P90", "P91", "P92", "P93", "P94", "P95", "P96", "Q00", "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15", "Q16", "Q17", "Q18", "Q20", "Q21", "Q22", "Q23", "Q24", "Q25", "Q26", "Q27", "Q28", "Q30", "Q31", "Q32", "Q33", "Q34", "Q35", "Q36", "Q37", "Q38", "Q39", "Q40", "Q41", "Q42", "Q43", "Q44", "Q45", "Q50", "Q51", "Q52", "Q53", "Q54", "Q55", "Q56", "Q60", "Q61", "Q62", "Q63", "Q64", "Q65", "Q66", "Q67", "Q68", "Q69", "Q70", "Q71", "Q72", "Q73", "Q74", "Q75", "Q76", "Q77", "Q78", "Q79", "Q80", "Q81", "Q82", "Q83", "Q84", "Q85", "Q86", "Q87", "Q89", "Q90", "Q91", "Q92", "Q93", "Q95", "Q96", "Q97", "Q98", "Q99", "R00", "R01", "R02", "R03", "R04", "R05", "R06", "R07", "R09", "R10", "R11", "R12", "R13", "R14", "R15", "R16", "R17", "R18", "R19", "R20", "R21", "R22", "R23", "R25", "R26", "R27", "R29", "R30", "R31", "R32", "R33", "R34", "R35", "R36", "R39", "R40", "R41", "R42", "R43", "R44", "R45", "R46", "R47", "R48", "R49", "R50", "R51", "R52", "R53", "R54", "R55", "R56", "R57", "R58", "R59", "R60", "R61", "R62", "R63", "R64", "R65", "R68", "R69", "R70", "R71", "R72", "R73", "R74", "R75", "R76", "R77", "R78", "R79", "R80", "R81", "R82", "R83", "R84", "R85", "R86", "R87", "R89", "R90", "R91", "R92", "R93", "R94", "R95", "R96", "R98", "R99", "S00", "S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17", "S19", "S20", "S21", "S22", "S23", "S24", "S25", "S26", "S27", "S28", "S29", "S30", "S31", "S32", "S33", "S34", "S35", "S36", "S37", "S38", "S39", "S40", "S41", "S42", "S43", "S44", "S45", "S46", "S47", "S48", "S49", "S50", "S51", "S52", "S53", "S54", "S55", "S56", "S57", "S58", "S59", "S60", "S61", "S62", "S63", "S64", "S65", "S66", "S67", "S68", "S69", "S70", "S71", "S72", "S73", "S74", "S75", "S76", "S77", "S78", "S79", "S80", "S81", "S82", "S83", "S84", "S85", "S86", "S87", "S88", "S89", "S90", "S91", "S92", "S93", "S94", "S95", "S96", "S97", "S98", "S99", "T00", "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10", "T11", "T12", "T13", "T14", "T15", "T16", "T17", "T18", "T19", "T20", "T21", "T22", "T23", "T24", "T25", "T26", "T27", "T28", "T29", "T30", "T31", "T32", "T33", "T34", "T35", "T36", "T37", "T38", "T39", "T40", "T41", "T42", "T43", "T44", "T45", "T46", "T47", "T48", "T49", "T50", "T51", "T52", "T53", "T54", "T55", "T56", "T57", "T58", "T59", "T60", "T61", "T62", "T63", "T64", "T65", "T66", "T67", "T68", "T69", "T70", "T71", "T73", "T74", "T75", "T78", "T79", "T80", "T81", "T82", "T83", "T84", "T85", "T86", "T87", "T88", "T90", "T91", "T92", "T93", "T94", "T95", "T96", "T97", "T98", "U04", "U06", "U07", "U80", "U82", "U83", "U89", "Z00", "Z01", "Z02", "Z03", "Z04", "Z08", "Z09", "Z10", "Z11", "Z12", "Z13", "Z20", "Z21", "Z22", "Z23", "Z24", "Z25", "Z26", "Z27", "Z28", "Z29", "Z30", "Z31", "Z32", "Z33", "Z34", "Z35", "Z36", "Z37", "Z38", "Z39", "Z40", "Z41", "Z42", "Z43", "Z44", "Z45", "Z46", "Z47", "Z48", "Z49", "Z50", "Z51", "Z52", "Z53", "Z54", "Z55", "Z56", "Z57", "Z58", "Z59", "Z60", "Z61", "Z62", "Z63", "Z64", "Z65", "Z70", "Z71", "Z72", "Z73", "Z74", "Z75", "Z76", "Z80", "Z81", "Z82", "Z83", "Z84", "Z85", "Z86", "Z87", "Z88", "Z89", "Z90", "Z91", "Z92", "Z93", "Z94", "Z95", "Z96", "Z97", "Z98", "Z99"]
)}

function _wrap(d3){return(
function wrap(text, width) {
  text.each(function() {
    let textNode = d3.select(this),
        words = textNode.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = textNode.attr("y"),
        dy = parseFloat(textNode.attr("dy") || 0),
        tspan = textNode.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = textNode.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
    
    const totalLines = lineNumber + 1;
    textNode.attr("transform", `translate(0, ${-(totalLines * 12)})`); 
  });
}
)}

function _wrapTickLabel(d3,getTextWidth){return(
function wrapTickLabel(text, width) {
  text.each(function () {
    const el = d3.select(this);
    const words = el.text().split(/\s+/).reverse();
    const lineHeight = 1.1;
    const x = el.attr("x") || -9;
    
    let word, line = [], lineNumber = 0;
    let tspan = el.text(null).append("tspan").attr("x", x).attr("dy", "0.32em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
     if (getTextWidth(line.join(" ")) > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = el.append("tspan")
          .attr("x", x)
          .attr("dy", lineHeight + "em")
          .text(word);
        lineNumber++;
      } else {
        tspan.text(line.join(" "));
      }
    }

    const totalLines = lineNumber + 1;
    el.selectAll("tspan").each(function(_, i) {
      const current = parseFloat(d3.select(this).attr("dy")) || 0;
      if (i === 0) {
        d3.select(this).attr("dy", (0.32 - (totalLines - 1) * lineHeight / 2) + "em");
      }
    });
  });
}
)}

function _getTextWidth(){return(
function getTextWidth(text, fontSize = "0.75rem", fontFamily = "sans-serif") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize} ${fontFamily}`;
  return ctx.measureText(text).width;
}
)}

function _formatLegendTicks(){return(
function formatLegendTicks(legend){

    switch(legend) {
      case "Year":
        return "";
      // case "APC in Admission Rate/100,000":
      //   return "+";
      // case "3-Yr Average Annual Change in Admission Rate/100,000":
      //   return "+";
      // case  "5-Yr CAGR(%) in Admission Rate/100,000":
      //   return "";
      default:
        return;
    }
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["2013-2022_DiagnosisGenderCAGRAnalysis_Df_2026-04-24.csv", {url: new URL("./files/6eb71792d72f044deee19fd590aaea8644d52fc9ef10e66fd3b73fcc638b18bb1fc585609707a8ee273c134f69db07415eceb2af11dae472ac8b52eb6c655f54.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof seleectedGender")).define("viewof seleectedGender", ["Inputs"], _seleectedGender);
  main.variable(observer("seleectedGender")).define("seleectedGender", ["Generators", "viewof seleectedGender"], (G, _) => G.input(_));
  main.variable(observer("viewof selectedICD10Chapters")).define("viewof selectedICD10Chapters", ["Inputs","icd10Chpaters"], _selectedICD10Chapters);
  main.variable(observer("selectedICD10Chapters")).define("selectedICD10Chapters", ["Generators", "viewof selectedICD10Chapters"], (G, _) => G.input(_));
  main.variable(observer("viewof selectedICD10Codes")).define("viewof selectedICD10Codes", ["Inputs","icd10Codes"], _selectedICD10Codes);
  main.variable(observer("selectedICD10Codes")).define("selectedICD10Codes", ["Generators", "viewof selectedICD10Codes"], (G, _) => G.input(_));
  main.variable(observer("viewof cagrRange")).define("viewof cagrRange", ["interval"], _cagrRange);
  main.variable(observer("cagrRange")).define("cagrRange", ["Generators", "viewof cagrRange"], (G, _) => G.input(_));
  main.variable(observer("viewof avg_3yr_growthRate")).define("viewof avg_3yr_growthRate", ["interval"], _avg_3yr_growthRate);
  main.variable(observer("avg_3yr_growthRate")).define("avg_3yr_growthRate", ["Generators", "viewof avg_3yr_growthRate"], (G, _) => G.input(_));
  main.variable(observer("viewof ageRange")).define("viewof ageRange", ["interval"], _ageRange);
  main.variable(observer("ageRange")).define("ageRange", ["Generators", "viewof ageRange"], (G, _) => G.input(_));
  main.variable(observer("viewof admissionsRange")).define("viewof admissionsRange", ["interval"], _admissionsRange);
  main.variable(observer("admissionsRange")).define("admissionsRange", ["Generators", "viewof admissionsRange"], (G, _) => G.input(_));
  main.variable(observer("viewof admissionRatePerCapita")).define("viewof admissionRatePerCapita", ["interval"], _admissionRatePerCapita);
  main.variable(observer("admissionRatePerCapita")).define("admissionRatePerCapita", ["Generators", "viewof admissionRatePerCapita"], (G, _) => G.input(_));
  main.variable(observer("viewof changeAdmissiionRatePerCapita")).define("viewof changeAdmissiionRatePerCapita", ["interval"], _changeAdmissiionRatePerCapita);
  main.variable(observer("changeAdmissiionRatePerCapita")).define("changeAdmissiionRatePerCapita", ["Generators", "viewof changeAdmissiionRatePerCapita"], (G, _) => G.input(_));
  main.variable(observer("viewof trueSurgeIndexNormalized")).define("viewof trueSurgeIndexNormalized", ["interval"], _trueSurgeIndexNormalized);
  main.variable(observer("trueSurgeIndexNormalized")).define("trueSurgeIndexNormalized", ["Generators", "viewof trueSurgeIndexNormalized"], (G, _) => G.input(_));
  main.variable(observer("viewof trueSurgeIndex")).define("viewof trueSurgeIndex", ["interval"], _trueSurgeIndex);
  main.variable(observer("trueSurgeIndex")).define("trueSurgeIndex", ["Generators", "viewof trueSurgeIndex"], (G, _) => G.input(_));
  main.variable(observer("viewof yearRange")).define("viewof yearRange", ["interval"], _yearRange);
  main.variable(observer("yearRange")).define("yearRange", ["Generators", "viewof yearRange"], (G, _) => G.input(_));
  main.variable(observer("viewof keyz")).define("viewof keyz", ["html","keys2"], _keyz);
  main.variable(observer("keyz")).define("keyz", ["Generators", "viewof keyz"], (G, _) => G.input(_));
  main.variable(observer("legend")).define("legend", ["Legend","viewof selection","keyz","formatLegendTicks"], _legend);
  main.variable(observer("viewof selection")).define("viewof selection", ["d3","keys2","data","keyz","wrapTickLabel","columns2"], _selection);
  main.variable(observer("selection")).define("selection", ["Generators", "viewof selection"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("cagr")).define("cagr", ["FileAttachment"], _cagr);
  const child1 = runtime.module(define1);
  main.import("interval", child1);
  main.variable(observer("icd10Chpaters")).define("icd10Chpaters", _icd10Chpaters);
  main.variable(observer("data")).define("data", ["cagr","cagrRange","ageRange","avg_3yr_growthRate","admissionsRange","admissionRatePerCapita","changeAdmissiionRatePerCapita","trueSurgeIndexNormalized","trueSurgeIndex","yearRange","seleectedGender","selectedICD10Chapters","selectedICD10Codes"], _data);
  main.variable(observer()).define(["__query","FileAttachment","invalidation"], _23);
  main.variable(observer()).define(["cagr"], _24);
  main.variable(observer("columns2")).define("columns2", _columns2);
  main.variable(observer("numericDims")).define("numericDims", _numericDims);
  main.variable(observer("categoricalDims")).define("categoricalDims", _categoricalDims);
  main.variable(observer("keys2")).define("keys2", _keys2);
  main.variable(observer("icd10Codes")).define("icd10Codes", _icd10Codes);
  const child2 = runtime.module(define2);
  main.import("legend", "Legend", child2);
  main.variable(observer("wrap")).define("wrap", ["d3"], _wrap);
  main.variable(observer("wrapTickLabel")).define("wrapTickLabel", ["d3","getTextWidth"], _wrapTickLabel);
  main.variable(observer("getTextWidth")).define("getTextWidth", _getTextWidth);
  main.variable(observer("formatLegendTicks")).define("formatLegendTicks", _formatLegendTicks);
  return main;
}
