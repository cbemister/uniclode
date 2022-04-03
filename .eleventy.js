const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const CharacterSet = require("characterset");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "serverless",
    functionsDir: "./netlify/functions/",
  });

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