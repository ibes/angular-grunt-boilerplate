'use strict';
var LIVERELOAD_PORT = 35725;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // angular html5 routing with rewrite
  var modRewrite = require('connect-modrewrite');

  grunt.initConfig({
    watch: {
      styles: {
        files: ['app/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          'app/**/*.html',
          '.tmp/styles/**/*.css',
          '{.tmp,app}/**/*.js',
          'app/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      stylus: {
        files: [
          'app/styles/{,*/}*.styl'
        ],
        tasks: ['stylus:compile']
      },
    },
    stylus: {
      compile: {
        options: {
          paths: [
            'node_modules/grunt-contrib-stylus/node_modules',
            'app/bower_components'
          ],
          urlfunc: 'embedurl'
        },
        files: [
          {
            expand: true,
            cwd: 'app/styles/',
            src: '*.styl',
            dest: '.tmp/styles/',
            ext: '.css'
          }
        ]
      },
      bootstrap: {
        options: {
          paths: ['app/bower_components/bootstrap-stylus/stylus/'],
          urlfunc: 'embedurl',
        },
        files: [{
          expand: true,
          cwd: 'app/bower_components/bootstrap-stylus/stylus/',
          src: ['bootstrap.styl', 'theme.styl'],
          dest: '.tmp/bower_components/bootstrap-stylus/styles/',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: grunt.option('port') || 9000,
        hostname: grunt.option('host') || 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect, options) {
            return [
              modRewrite([
                '!\\.\\w+(\\?.*)?$ /'
              ]),
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app'),
              connect.static(options.base)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              modRewrite([
                '!\\.\\w+(\\?.*)?$ /'
              ]),
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              modRewrite([
                '!\\.\\w+(\\?.*)?$ /'
              ]),
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
            'dist/.git*',
            'dist'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/modules/{,*/}*.js'
      ]
    },
    rev: {
      dist: {
        files: {
          src: [
            'dist/scripts/{,*/}*.js',
            'dist/styles/{,*/}*.css',
            'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '!dist/images/norev/*',
            'dist/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/{,*/}*.html'],
      css: ['dist/styles/{,*/}*.css'],
      options: {
        dirs: ['dist']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: 'dist/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '{,*/}*.svg',
          dest: 'dist/images'
        }]
      }
    },
    cssmin: {
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: 'app',
          src: ['*.html', 'views/**/*.html'],
          dest: 'dist'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.{jpg,jpeg,gif,webp}',
            'fonts/*',
            '**/*.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: 'dist/images',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: 'app/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      server: [
        'stylus',
        'copy:styles'
      ],
      test: [
        'stylus',
        'copy:styles'
      ],
      dist: [
        'stylus',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    cdnify: {
      dist: {
        html: ['dist/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/scripts',
          src: '*.js',
          dest: 'dist/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/scripts/scripts.js': [
            'dist/scripts/scripts.js'
          ]
        }
      }
    }
  });

  // stylus task declaration
  grunt.loadNpmTasks('grunt-contrib-stylus');

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cdnify',
    'ngmin',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
