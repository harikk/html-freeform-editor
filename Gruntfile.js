module.exports = function (grunt) {
    var liveApiUrl = "https://social-outreach.appspot.com";
    var serverFileLocation = "../server/target/advocacy-0.0.1-SNAPSHOT/public";
    // var liveApiUrl = "https://app.advocacybuzz.com";
    var localApiUrl = "http://localhost:8888";
    grunt.initConfig({
        wiredep: {
            live: {
                src: ["dist/index.html"]
            },
            dev: {
                src: ["www/index.html"]
            }
        },
        copy: {
            server: {
                files: [{
                        expand: true,
                        cwd: "dist/",
                        src: "**",
                        dest: serverFileLocation
                    }]
            },
            live: {
                files: [{
                        expand: true,
                        cwd: "www/",
                        src: "**",
                        dest: "dist/"
                    }, {
                        expand: true,
                        cwd: "www/bower_components/components-font-awesome/",
                        src: "fonts/**/*",
                        dest: "dist"
                    }, {
                        expand: true,
                        cwd: "www/bower_components/bootstrap/dist",
                        src: "fonts/**/*",
                        dest: "dist"
                    }, {
                        expand: true,
                        cwd: "www/bower_components/ionicons",
                        src: "fonts/**/*",
                        dest: "dist"
                    }, {
                        expand: true,
                        cwd: "www/bower_components/summernote/dist",
                        src: "font/**/*",
                        dest: "dist/css"
                    }]
            }
        },
        useminPrepare: {
            html: ['dist/index.html', 'dist/editor/editor.html'],
            options: {
                dest: "dist"
            }
        },
        usemin: {
            html: ['dist/index.html', 'dist/editor/editor.html'],
            options: {
                dest: "dist"
            }
        },
        clean: {
            dist: ["dist", ".tmp"],
            live: [".tmp", "dist/bower_components", "dist/css/*.css",
                "dist/app/**/*.js", "dist/js/**/*",
                "!dist/css/app.min.css*", "!dist/css/third-party.min.css*",
                "!dist/app/app.min.js*", "!dist/js/third-party.min.js*",
                "dist/editor/*.js", "dist/editor/*.css",
                "!dist/editor/editor.thirdparty.min.js",
                "!dist/editor/editor.min.js",
                "!dist/editor/editor.min.css",
                "!dist/editor/editor-preview.min.css"]
        },
        'string-replace': {
            inline: {
                files: {
                    'dist/': ['dist/app/app.min.js',
                        'dist/editor/editor.min.js']
                },
                options: {
                    replacements: [{
                            pattern: localApiUrl,
                            replacement: liveApiUrl
                        }]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks("grunt-wiredep");
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask("clean-all", ["clean:dist"]);
    grunt.registerTask("build-dev", ["wiredep:dev"]);
    grunt.registerTask("build-live", ["clean:dist", "copy:live", "wiredep:live", "useminPrepare", "concat", "uglify", "cssmin", "usemin", "string-replace", "clean:live"]);
    grunt.registerTask("deploy", ["build-live", "copy:server", "clean:dist"]);
    grunt.registerTask("default", ["deploy"]);
};