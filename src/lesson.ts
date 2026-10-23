import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 51,
  title: "State Reconciliation and Merging",
  description: "Parallel workers eventually need to combine their changes. Passing tests in separate worktrees is not enough, because interfaces and behavior can fail only when the patches meet.",
  concepts: ["Test a merge candidate before promotion", "Bind CI proof to its commit", "Compare-and-set the integration ref"],
  scope: "Executes a pure two-phase candidate merge gate. It does not run Git or advance a repository reference. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Accept a tested candidate", "input": {"expectedBase": "base-1", "currentBase": "base-1", "testExit": 0, "buildExit": 0, "reviewApproved": true}, "expected": "passed", "checks": {"promotionPlanned": true}}, {"id": "1", "label": "Reject a moving integration base", "input": {"expectedBase": "base-1", "currentBase": "base-2", "testExit": 0, "buildExit": 0, "reviewApproved": true}, "expected": "conflict", "checks": {"promotionPlanned": false}}, {"id": "2", "label": "Keep a failing candidate for review", "input": {"expectedBase": "base-1", "currentBase": "base-1", "testExit": 1, "buildExit": 0, "reviewApproved": true}, "expected": "rejected", "checks": {"promotionPlanned": false}}],
  async run(input) {

if(text(input,"expectedBase")!==text(input,"currentBase"))return report("conflict","Integration ref moved; recompute a candidate",{promotionPlanned:false},["Check the expected old reference before promotion"]);
const passed=number(input,"testExit")===0&&number(input,"buildExit")===0&&flag(input,"reviewApproved");
return report(passed?"passed":"rejected",passed?"Prepared promotion of a checked merge candidate":"Preserve the candidate and failed gate evidence",{promotionPlanned:passed,tests:number(input,"testExit"),build:number(input,"buildExit"),mainUpdated:false},["Construct an isolated candidate","Run checks against that candidate","Bind the evidence to its revision","Promote staging with compare-and-set; main needs a separate gate"]);

  }
};
