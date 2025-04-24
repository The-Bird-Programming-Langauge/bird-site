import { inlineCopilot } from "codemirror-copilot";
import { CohereClientV2 } from "cohere-ai";

/**
 * This is not currently being used due to request rate limits
 * it can be added to the codemirror extensions in the future
 */

export const copilot = inlineCopilot(async (prefix, suffix) => {
  const cohere = new CohereClientV2({
    token: "docaDTWtZ6jRfZuQwIaX52wSygzp1F1WapqncexV",
  });

  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "system",
          content: `
          The following is documentation for the Bird programming language:

          // single line comment
          /* multi-line comment */

          var x: bool = true;
          var x = true;
          const x: bool = true;

          var x: int = 5;
          x = 5;
          x += 5;
          x -= 5;
          x /= 5;
          x *= 5;
          x %= 5;
          x = 1 + (x += 1);

          type a = int;
          type b = bool;
          type c = float;
          type d = str;
          var e: a = 5;

          print "string";
          print 15;
          print "string", 15, 5.5, true;

          var x = 1 + 2 - 3 * 4 / 5 % 6 + -(7 + 8);
          var x = 1 > 2 or 3 < 4 and 5 >= 6 or 7 <= 8 and 9 == 10 or 11 != 12 and not true and not (true or false);
          var x = true ? 1 : 2;

          if false {
            x = 2;
          } else if true {
            x = 3;
          } else {
            x = 4;
          }
          
          var z = 0;
          for var x: int = 0; x < 5; x += 1 {
            if x == 3 {
              continue;
            }
            if x == 4 {
              break;
            }
            z += 1;
          }

          while true {
            print "hello";
          }

          fn sayName(name: str) {
            print name;
          }
          fn sayName(name: str) -> void {
            print name;
          }
          const name: str = "Dennis Ritchie";
          sayName(name);
          fn add(x: int, y: int) -> int {
            return x + y;
          }

          You are a Bird programmer that replaces <FILL_ME> part with the right code. Only output the code that replaces <FILL_ME> part. Do not add any explanation or markdown.
          `,
        },
        {
          role: "user",
          content: `${prefix}<FILL_ME>${suffix}`,
        }
      ]
    });

    let prediction = response.message?.content?.[0]?.text ?? "";
    return prediction;
  } catch (error) {
    return "";
  }
}, 500, false); // delay, disables mouse clickable completions