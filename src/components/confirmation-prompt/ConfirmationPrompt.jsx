import _ from "lodash";
import { useState, useEffect } from "react";
import "./promt.css";

export default function ConfimationPrompt({ prompt, callback }) {
  const [showPrompt, setPromptVisibility] = useState(false);

  useEffect(() => {
    if (callback) setPromptVisibility(true);
  }, [callback]);

  return (
    showPrompt && (
      <Prompt
        prompt={prompt}
        callback={callback}
        final={() => setPromptVisibility(false)}
      />
    )
  );
}

const Prompt = ({
  prompt = "Are you sure about that?",
  callback = _.noop,
  final = _.noop,
}) => {
  const action = _.flow([callback, final]);
  return (
    <div className="confirmation-prompt">
      {prompt}
      <div className="confirmation-call-to-actions">
        <button onClick={() => action(true)}>Continue</button>
        <button onClick={() => action(false)} className="secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};
