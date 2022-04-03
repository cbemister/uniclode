const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const CharacterSet = require("characterset");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "serverless",
    functionsDir: "./netlify/functions/",
  });

  let commaChar = "x";
  let plusChar = "";
  let isRangePrefix = "_";
  function encodeRange(range = "") {
    return isRangePrefix + range.split("U+").join(plusChar).split(",").join(commaChar);
  }
  function decodeRange(str = "") {
    return str.split(commaChar).map(entry => `U+${entry}`).join(",");
  }
  function getCharsetFromRange(str = "") {
    if(str.startsWith(isRangePrefix)) {
      return CharacterSet.parseUnicodeRange(decodeRange(str.substr(isRangePrefix.length)));
    }

    return new CharacterSet(str);
  }
  function isSubset(code, characters) {
    let charset = getCharsetFromRange(characters);
    let codeCharset = new CharacterSet(code);
    return codeCharset.subset(charset);
  }

  eleventyConfig.addFilter("charCodeToString", code => String.fromCharCode(code));

  eleventyConfig.addFilter("charsetUrl", (code, previousCharacters) => {
    let charset = getCharsetFromRange(previousCharacters);
    if(isSubset(code, previousCharacters)) {
      charset.remove(code); // toggle off
    } else {
      charset.add(code); // toggle on
    }

    let slug = encodeRange(charset.toHexRangeString());
    if(slug) {
      return `/${slug}/`;
    }
    return "/";
  });

  eleventyConfig.addFilter("charactersToRange", (characters) => {
    let charset = getCharsetFromRange(characters);
    return charset.toHexRangeString();
  });

  eleventyConfig.addFilter("inCharacterSet", (code, characters) => isSubset(code, characters));

    return {
      templateFormats: ["md", "njk", "html", "liquid"],

      // If your site lives in a different subdirectory, change this.
      // Leading or trailing slashes are all normalized away, so don’t worry about it.
      // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
      // This is only used for URLs (it does not affect your file structure)
      pathPrefix: "/",

      markdownTemplateEngine: "liquid",
      htmlTemplateEngine: "njk",
      dataTemplateEngine: "njk",
      dir: {
        input: "src",
        includes: "_includes",
        data: "_data",
        output: "_site",
      },
    };

};