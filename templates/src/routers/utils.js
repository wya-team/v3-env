const HASH_RE = /#/g; // %23
const AMPERSAND_RE = /&/g; // %26
const SLASH_RE = /\//g; // %2F
const EQUAL_RE = /=/g; // %3D
const IM_RE = /\?/g; // %3F
const PLUS_RE = /\+/g; // %2B
const ENC_BRACKET_OPEN_RE = /%5B/g; // [
const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
const ENC_CARET_RE = /%5E/g; // ^
const ENC_BACKTICK_RE = /%60/g; // `
const ENC_CURLY_OPEN_RE = /%7B/g; // {
const ENC_PIPE_RE = /%7C/g; // |
const ENC_CURLY_CLOSE_RE = /%7D/g; // }
const ENC_SPACE_RE = /%20/g; // }

const commonEncode = (text) => {
	return encodeURI('' + text)
	  .replace(ENC_PIPE_RE, '|')
	  .replace(ENC_BRACKET_OPEN_RE, '[')
	  .replace(ENC_BRACKET_CLOSE_RE, ']');
};

export const encodeQueryValue = (text) => {
	return (
	  commonEncode(text)
			// Encode the space as +, encode the + to differentiate it from the space
			.replace(PLUS_RE, '%2B')
			.replace(HASH_RE, '%23')
			.replace(AMPERSAND_RE, '%26')
			.replace(ENC_BACKTICK_RE, '`')
			.replace(ENC_CURLY_OPEN_RE, '{')
			.replace(ENC_CURLY_CLOSE_RE, '}')
			.replace(ENC_CARET_RE, '^')
	);
};
  
/**
   * Like `encodeQueryValue` but also encodes the `=` character.
   *
   * @param text - string to encode
   */
export const encodeQueryKey = (text) => {
	return encodeQueryValue(text).replace(EQUAL_RE, '%3D');
};

export const stringifyQuery = (query) => {
	let search = '';
	for (let key in query) {
		const value = query[key];
		key = encodeQueryKey(key);
		if (value == null) {
			if (value !== undefined) {
				search += (search.length ? '&' : '') + key;
			}
			// eslint-disable-next-line no-continue
			continue;
		}
		// keep null values
		const values = Array.isArray(value) 
			? value.map(v => v && encodeQueryValue(v))
			: [value && encodeQueryValue(value)];

		// eslint-disable-next-line no-loop-func
		values.forEach(val => {
			if (val !== undefined) {
				search += (search.length ? '&' : '') + key;
				if (val != null) search += '=' + val;
			}
		});
	}
	return search;
};