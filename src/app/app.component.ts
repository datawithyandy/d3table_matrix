import { Component, OnInit, VERSION } from "@angular/core";
import {
  csv,
  extent,
  interpolateGreens,
  merge,
  mouse,
  scaleBand,
  scaleSequential,
  select,
  Selection,
  text
} from "d3";
import { Corpus, Similarity } from "tiny-tfidf";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  metadata: Array<any> | any;
  states: Array<string> | any;
  files: Array<string> | any;
  speeches: Array<string> | any;

  name = "Angular " + VERSION.major;

  ngOnInit() {
    this.setState();
  }

  async setState() {
    let matrix: any,
      tooltip: any,
      corpus: Corpus,
      color: any,
      extendedMatrix: Array<any>,
      div: Selection<any, any, HTMLElement, any> | any,
      K1 = 2.0,
      b = 0.75,
      useStopwords = true,
      customStopwords = [],
      maxCF = 30,
      similarity: Similarity,
      size = 850,
      margin = { topAndLeft: 120, bottomAndRight: 120 };

    await csv(
      "https://raw.githubusercontent.com/fivethirtyeight/data/master/state-of-the-state/index.csv"
    ).then(data => {
      this.states = data.map(d => d.state);
      this.files = data.map(
        d =>
          "https://raw.githubusercontent.com/fivethirtyeight/data/master/state-of-the-state/speeches/" +
          d.filename
      );
    });

    await Promise.all(this.files.map(d => text(d))).then(
      pres => (this.speeches = pres)
    );
    corpus = new Corpus(
      this.states,
      this.speeches,
      useStopwords,
      customStopwords,
      K1,
      b
    );

    console.log(corpus)

    similarity = new Similarity(corpus);
    matrix = similarity.getDistanceMatrix();
    extendedMatrix = merge(matrix.matrix).filter(d => d > 0.01);
    const ext: any = extent(extendedMatrix).reverse();
    color = scaleSequential(interpolateGreens).domain(ext);

    const scale = scaleBand()
      .domain(matrix.identifiers)
      .range([margin.topAndLeft, size - margin.bottomAndRight])
      .padding(0.1);

    div = select("#bus_matrix").style("overflow-x", "auto");
    tooltip = div
      .selectAll("#matrix-tooltip")
      .data([null]) // only append the tooltip div if it doesn't already exist
      .join("div")
      .attr("id", "matrix-tooltip")
      .style("display", "none");

    const svg = div
      .append("svg")
      .attr("width", size)
      .attr("height", size);

    const data = merge(
      matrix.matrix.map((d, i) =>
        d.map((value, j) => ({ row: i, column: j, value }))
      )
    );

    // console.log(data);
    // console.log(this.states);
    // console.log(this.speeches);
    // console.log(useStopwords);
    // console.log(customStopwords);

    let showTooltip = function(d) {
      const state1 = matrix.identifiers[d.row];
      const state2 = matrix.identifiers[d.column];

      const commonTerms = corpus
        .getCommonTerms(state1, state2, 10)
        .map(d => `<li>${d[0]}</li>`)
        .join("");

      const [x, y] = mouse(div.node());
      tooltip
        .html(
          `${state1} to ${state2}: ${d.value.toFixed(2)}<ul>${commonTerms}</ul>`
        )
        .style("top", y + "px")
        .style("left", x + 15 + "px");

      tooltip.style("display", null);
    };
    let hideTooltip = function() {
      tooltip.style("display", "none");
    };

    svg
      .selectAll(".cell")
      .data(data)
      .join("rect")
      .attr("class", "cell")
      .attr("x", d => scale(matrix.identifiers[d["row"]]))
      .attr("y", d => scale(matrix.identifiers[d["column"]]))
      .attr("width", scale.bandwidth())
      .attr("height", scale.bandwidth())
      .attr("fill", d =>
        d["row"] === d["column"] ? "lightgray" : color(d["value"])
      )
      .on("mouseenter", function(d) {
        select(this).style("stroke", "gray");
        showTooltip(d);
      })
      .on("mouseleave", function() {
        select(this).style("stroke", null);
        hideTooltip();
      });

    svg
      .selectAll(".row-label")
      .data(matrix.identifiers)
      .join("text")
      .attr("class", "row-label")
      .attr("x", margin.topAndLeft - 5)
      .attr("y", d => scale(d) + scale.bandwidth() / 2)
      .text(d => d)
      .attr("dy", "1.0em")
      .attr("text-anchor", "end");
      // .attr("dy", "0.35em")

    svg
      .append("g")
      .attr("transform", `translate(0,${margin.topAndLeft}) rotate(-90)`)
      .selectAll(".column-label")
      .data(matrix.identifiers)
      .join("text")
      .attr("class", "column-label")
      .attr("x", 5)
      .attr("y", d => scale(d) + scale.bandwidth() / 2)
      .text(d => d)
      .attr("dy", "1.0em");
      // .attr("dy", "0.35em");

    div.node();

  }
}
