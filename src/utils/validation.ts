const validEmailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const whitespacePattern = /\s+g/;

const filterWhitespace = (sentence: string) => {
    return sentence.replace(whitespacePattern, " ").trim().split(" ");
};

const user = {
    email: (value: string): boolean => validEmailPattern.test(value),
    password: (value: string): boolean => !(value.length < 8),
};

export { user, filterWhitespace };