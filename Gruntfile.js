module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        clean: ["./dist/"],
        
        copy: {
            main: {
              src: './views/**',
              dest: './dist/',
            },
        },

        jadeUsemin: {
            scripts: {
                options: {
                    tasks: {
                        js: ['concat', 'uglify']
//    ,
//                        css: ['concat', 'cssmin']
                    }
                },
                files: [{
                    dest: './dist/views/index.jade',
                    src: './views/index.jade'
                }]
            }
        },

    
//        uglify: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//            },
//            my_target: {
//                files: [{
//                        'build/grunt/dist/app-only.min.js': [
//                             'public/js/app.js',
//                             'public/js/services.js',
//                             'public/js/filters.js',
//                             'public/js/directives.js',
//                             'public/js/controllers.js',
//                             'public/js/lib/multiselect/cats-multiselect-tpls.js',
//                             'public/js/lib/multiselect/cats-artistselect-tpls.js',
//                             'bower_components/amitava82/angular-multiselect/src/multiselect-tpls.js'
//                          ]
//                }]
//            }
//        },
//        concat: {
//            options: {
//                // define a string to put between each file in the concatenated output
//                separator: ';'
//            },
//            dist: {
//                // the files to concatenate
//                src: [  
//                    'build/grunt/dist/app-only.min.js'
//                    ],
//                dest: 'build/grunt/dist/<%= pkg.name %>.js'
//            }
//        }
  });

  // Load the plugins that provide the tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jade-usemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'jadeUsemin']);
};
