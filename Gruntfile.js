module.exports = function (grunt) {
    var nodemon_ignore = ['node_modules/**/*', 'static/**/*', 'production/**/*', 'Gruntfile.js'];

    grunt.initConfig({
        SASS_DIR: "sass",
        DEV_DIR: "static",
        PROD_DIR: "production/static",

        //Glob CONSTANTS
        ALL_FILES: "**/*",
        ALL_JS: "**/*.js",
        MIN_CSS: "**/*.min.css",
        ALL_SCSS: "**/*.scss",
        ALL_HTML: "**/*.html",

        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/*\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>\n <%= pkg.author %>' +
                ' \n*/\n'
        },

        //////////////////////Distribution

        compass: {
            compile: {
                options: {
                    config: 'sass-config.rb'
                }
            }
        },
        copy: {
            assets: {
                expand: true,
                cwd: '<%= DEV_DIR %>/',
                src: [],
                dest: '<%= PROD_DIR %>/'
            }
        },

        cssmin: {
            minify: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                expand: true,
                cwd: '<%= DEV_DIR %>/stylesheets',
                src: ['*.css'],
                dest: '<%= PROD_DIR %>/stylesheets',
                ext: '.min.css'
            }
        },
        processhtml: {
            dist: {
                files: {
                    'production/views/index.html': 'views/index.html'
                }
            }
        },
        clean: {
            temp: "<%= TEMP_DIR %>",
            dist: "<%= PROD_DIR %>"
        },

        ///////////////////Environment stuff

        watch: {
            css: {
                files: ["<%= SASS_DIR %>/<%= ALL_SCSS %>"],
                tasks: ["compass"]
            }
        },

        nodemon: {
            dev: {
                script: 'start.js',
                options: {
                    args: ['app.js'].concat(grunt.option.flags()),
                    ignore: nodemon_ignore,
                    delay: 100
                }
            },
            prod: {
                script: 'start.js',
                options: {
                    args: ['app.js', '--env=production'].concat(grunt.option.flags()),
                    ignore: nodemon_ignore,
                    delay: 100
                }
            },
            test: {
                script: 'start.js',
                options: {
                    args: ['app.js'].concat(grunt.option.flags()),
                    ignore: nodemon_ignore,
                    delay: 100
                }
            }
        },

        bgShell: {
            _defaults: {
                stdout: true,
                stderr: true
            },
            run_watch_css: {
                cmd: 'grunt watch:css',
                bg: true
            }
        }


    });

    require('load-grunt-tasks')(grunt);

    //running the app
    grunt.registerTask('dev', ['compass', 'bgShell:run_watch_css', 'nodemon:dev']);
    grunt.registerTask('prod', ['nodemon:prod']);

    //compiling
    grunt.registerTask('dist', ['clean:dist', 'compass', 'copy:assets', 'cssmin:minify', 'processhtml:dist']);


    //default
    grunt.registerTask('default', ['dev']);
};