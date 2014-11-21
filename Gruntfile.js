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
        }
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
