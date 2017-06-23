/// <binding />
/**
 * Created by eric.kono on 19/10/2016.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        autoprefixer:{
            dist:{
                files:{
                    "dist/css/octopus-material.css":"dist/css/octopus-material.css",
                    "dist/css/octopus-material.min.css":"dist/css/octopus-material.min.css"
                }
            }
        },
        sass: {
            compressed: {
                options: {
                    style: "compressed"
                },
                files: [
                    {
                        cwd: "sass",
                        src: ["**/*.sass", "**/*.scss"],
                        dest: "dist/css",
                        expand: true,
                        ext: ".min.css"
                    }
                ]
            },
            normal: {
                files: [
                    {
                        cwd: "sass",
                        src: ["**/*.sass", "**/*.scss"],
                        dest: "dist/css",
                        expand: true,
                        ext: ".css"
                    }
                ]
            }
        },
        pug: {
            docs: {
                options: {
                    data: {
                        debug: true,
                        version: "<%= pkg.version + '.' + pkg.build %>"
                    },
                    pretty: true
                },
                files: [
                    {
                        cwd: "docs",
                        src: ["**/*.pug", "!layout.pug"],
                        dest: "docs",
                        expand: true,
                        ext: ".html"
                    }
                ]
            }
        },
        watch: {
            sass: {
                files: ["sass/**/*.sass", "sass/**/*.scss"],
                tasks: ["sass", "autoprefixer"]
            },
            "pug": {
                files: ["docs/**/*.pug"],
                tasks: ["pug:docs"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-pug");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask("default", ["watch"]);
};
