import * as moo from 'moo';

export function lex(birdCode: string): string {
    const lexer = moo.compile({
        darkGreen: [/\/\/.*?$/, /\/\*[\s\S]*?\*\//],
        white: { match: [" ", "\n", "\t", "+", "-", "*", "/", "%", "=", "+=", "-=", "*=", "/=", "%=", "->", "==", "!=", ">", "<", ">=", "<=", ";", ".", ",", ":"], lineBreaks: true },
        darkBlue: ['var', 'const', 'type', 'fn'],
        green: ['int', 'bool', 'float'],
        purple: ["if", "else", "while", "for", "return", "match"],
        orange: ['(', ')', '{', '}'],
        yellow: /0|[1-9]\d*/,
        lightBlue: /[a-zA-Z_]\w*/,
    });


    lexer.reset(birdCode);

    let returnText = '';

    while (true) {
        const token = lexer.next();
        if (!token) break;

        switch (token.type) {
            case 'white':
                returnText += token.value;
                break;

            case 'darkGreen':
                returnText += `<code class="text-emerald-600">${token.value}</code>`;
                break;

            case 'darkBlue':
                returnText += `<code class="text-sky-600">${token.value}</code>`;
                break;

            case 'lightBlue':
                returnText += `<code class="text-sky-300">${token.value}</code>`;
                break;

            case 'yellow':
                returnText += `<code class="text-yellow-300">${token.value}</code>`;
                break;

            case 'green':
                returnText += `<code class="text-green-400">${token.value}</code>`;
                break;

            case 'orange':
                returnText += `<code class="text-orange-300">${token.value}</code>`;
                break;

            case 'purple':
                returnText += `<code class="text-pink-400">${token.value}</code>`;
                break;

            default:
                returnText += token.value;
        }
    }

    return returnText;

}