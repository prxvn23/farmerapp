module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: { mangle: true, compress: true },
      build: {
        files: [{
          expand: true,
          cwd: '../client/build/static/js',
          src: ['**/*.js', '!**/*.min.js'],
          dest: '../client/build/static/js',
          ext: '.min.js'
        }]
      }
    },

    cssmin: {
      build: {
        files: [{
          expand: true,
          cwd: '../client/build/static/css',
          src: ['**/*.css', '!**/*.min.css'],
          dest: '../client/build/static/css',
          ext: '.min.css'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['uglify', 'cssmin']);
};
