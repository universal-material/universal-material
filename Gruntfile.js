/// <binding />
/**
 * Created by eric.kono on 19/10/2016.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
        watch: {
            sass: {
                files: ["sass/**/*.sass", "sass/**/*.scss"],
                tasks: ["sass"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["watch"]);
};
