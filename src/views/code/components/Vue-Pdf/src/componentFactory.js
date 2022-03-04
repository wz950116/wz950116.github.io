import resizeSensor from 'vue-resize-sensor'

export default function (pdfjsWrapper) {
  var createLoadingTask = pdfjsWrapper.createLoadingTask
  var PDFJSWrapper = pdfjsWrapper.PDFJSWrapper

  return {
    createLoadingTask: createLoadingTask,
    data() {
      return {
        pageNum: this.page,
        numPages: null
      }
    },
    render(h) {
      const { numPages } = this
      return h('span', {
        attrs: {
          style: 'position: relative; display: inline-block'
        }
      }, [
        h('canvas', {
          attrs: {
            style: 'display: inline-block; width: 100%; vertical-align: top'
          },
          ref: 'canvas'
        }),
        h('span', {
          style: 'display: inline-block; width: 100%',
          class: 'annotationLayer',
          ref: 'annotationLayer'
        }),
        h('div', {
          attrs: {
            class: 'pdf-control',
            style: `display: ${numPages > 0 ? 'flex' : 'none'} ;position:relative;width: 100%;height: 50px;line-height: 50px;padding: 0px 16px;background: rgba(103, 103, 103, 1);justify-content: space-between;font-size: 14px;color: #fff;`
          }
        }, [h('div', {
          attrs: {
            class: 'pdf-control-page'
          }
        }, [h('i', {
          attrs: {
            class: 'el-icon-arrow-left',
            style: 'cursor: pointer'
          },
          on: {
            click: () => {
              if (this.pageNum <= 1) return
              this.pageNum--
              this.pdf.loadPage(this.pageNum, this.rotate)
            }
          }
        }), h('span', {
          attrs: {
            class: 'page-number-container',
            style: 'margin: 0px 7px;'
          }
        }, [h('input', {
          attrs: {
            type: 'number',
            class: 'page-number-input',
            style: `width: 50px;
            background-color: #363636;
            border: none;
            border-radius: 2px;
            padding: 2px 4px;
            box-sizing: border-box;
            color: #fff;`
          },
          domProps: {
            value: this.pageNum
          },
          on: {
            blur: (event) => {
              this.pageNum = event.target.value * 1
              this.pdf.loadPage(this.pageNum, this.rotate)
            }
          }
        }), h('span', ` / ${numPages}`)]), h('i', {
          attrs: {
            class: 'el-icon-arrow-right',
            style: 'cursor: pointer'
          },
          on: {
            click: () => {
              if (this.pageNum >= this.numPages) return
              this.pageNum++
              this.pdf.loadPage(this.pageNum, this.rotate)
            }
          }
        })])]),
        h(resizeSensor, {
          props: {
            initial: true
          },
          on: {
            resize: this.resize
          }
        })
      ])
    },
    props: {
      src: {
        type: [String, Object, Uint8Array],
        default: ''
      },
      page: {
        type: Number,
        default: 1
      },
      rotate: {
        type: Number
      }
    },
    watch: {
      src: function () {
        this.pdf.loadDocument(this.src)
      },
      page: function () {
        this.pdf.loadPage(this.page, this.rotate)
      },
      rotate: function () {
        this.pdf.renderPage(this.rotate)
      }
    },
    methods: {
      resize: function (size) {
        // check if the element is attached to the dom tree || resizeSensor being destroyed
        if (this.$el.parentNode === null || (size.width === 0 && size.height === 0)) { return }

        // on IE10- canvas height must be set
        this.$refs.canvas.style.height = this.$refs.canvas.offsetWidth * (this.$refs.canvas.height / this.$refs.canvas.width) + 'px'
        // update the page when the resolution is too poor
        var resolutionScale = this.pdf.getResolutionScale()

        if (resolutionScale < 0.85 || resolutionScale > 1.15) { this.pdf.renderPage(this.rotate) }

        this.$refs.annotationLayer.style.transform = 'scale(' + resolutionScale + ')'
      },
      print: function (dpi, pageList) {
        this.pdf.printPage(dpi, pageList)
      }
    },

    // doc: mounted hook is not called during server-side rendering.
    mounted: function () {
      this.pdf = new PDFJSWrapper(this.$refs.canvas, this.$refs.annotationLayer, this.$emit.bind(this))
      this.$on('loaded', function () {
        this.pdf.loadPage(this.page, this.rotate)
      })

      this.$on('page-size', function (width, height) {
        this.$refs.canvas.style.height = this.$refs.canvas.offsetWidth * (height / width) + 'px'
      })

      this.$on('num-pages', function (num) {
        this.numPages = num
      })

      this.pdf.loadDocument(this.src)
    },

    // doc: destroyed hook is not called during server-side rendering.
    destroyed: function () {
      this.pdf.destroy()
    }
  }
}
