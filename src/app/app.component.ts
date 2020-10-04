import { Component, OnInit, VERSION } from "@angular/core";

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

  async setState() {}
}
