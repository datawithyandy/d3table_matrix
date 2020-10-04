import { Component, OnInit, VERSION } from "@angular/core";
import { csv, extent, interpolateGreens, merge, mouse, scaleBand, scaleSequential, select, Selection, text } from 'd3';
import { Corpus, Similarity } from 'tiny-tfidf';


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
  }
}
