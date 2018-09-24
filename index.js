
import gsap, { TweenMax, Power1, Power2, Power3, Power4, Back, Elastic, Bounce, RoughEase, SlowMo, SteppedEase, Circ, Expo, Sine, CustomEase } from 'gsap/TweenMax';

export default {
  variables: {
    fzElements: [],
    animationData: null,
    tweenAnimation: null,
    animationProps: null,
    parsedAnimationProps: null,
    isMobile: null,
    isTextElement: null,
    splitTextHTML: null,
    inViewPort: null,
    triggerOffset: null,
    animation: null,
    elChildren: null,
    staggerAnimation: null,
    staggerDelay: null,
    scrollContainer: null,
    animationDelay: 0,
    allowMobile: false,

    functions: {
      toConsumableArray: function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } },
      omitEmpty: function(obj){
        Object.keys(obj).forEach(key => obj[key] === undefined || obj[key] === null ? delete obj[key] : '');
      },
      getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    },
  
    checkIfInViewPort: function(el, animationData, rect){

      var self = this

      if(window.scrollY === 0 && document.querySelector('[fizzeroll-top-reset]')) {
        self.masterReset()
      }
  
      if(self.scrollContainer.tagName === 'BODY') {
        self.inViewPort = (rect.left + animationData.offset)  < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
        (rect.top + animationData.offset) < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
      } else {
        self.inViewPort = (rect.left + animationData.offset)  < (self.scrollContainer.innerWidth) /* or $(window).width() */ &&
        (rect.top + animationData.offset) < (self.scrollContainer.innerHeight) /* or $(window).height() */;
      }
  
      if(self.inViewPort){
        
          self.runAnimation(el, animationData)
        
        
      } else {
  
        self.reset(el, animationData)
  
      }
    },
    
    runAnimation: function(el, animationData) {
      
      var self  = this
  
      if(el.className.indexOf('fz-active') < 0) {
        
        el.classList.add('fz-active')
  
        if (animationData.type === 'stagger') {
  
          animationData.staggerTimeout = []
  
          if(animationData.animationLazy) {
  
            animationData.animationLazy.forEach((eachAnimation, k) => {
              setTimeout(() => {
                eachAnimation.play()
              }, animationData.animationDelayLazy[k] * 1000)
            })
            
            animationData['played'] = true
  
            animationData.animationLazy.forEach((eachAnimation, k) => {
              setTimeout(() => {
                eachAnimation.restart()
              }, animationData.animationDelayLazy[k] * 1000)
              
            })
  
          } else {
            animationData.animation.forEach((eachAnimation, k) => {
              animationData.staggerTimeout.push(setTimeout(() => {
                eachAnimation.play()
              }, animationData.animationDelay[k] * 1000))
            })
            
            animationData['played'] = true
  
            animationData.animation.forEach((eachAnimation, k) => {
              animationData.staggerTimeout.push(setTimeout(() => {
                eachAnimation.restart()
              }, animationData.animationDelay[k] * 1000))
              
            })
          }
  
        } else {
  
          setTimeout(() => {
            animationData.animation.play()
          }, animationData.animationDelay * 1000)
  
          animationData['played'] = true
  
          if(animationData.played) {
            setTimeout(() => {
              animationData.animation.restart()
            }, animationData.animationDelay * 1000)
          }
        }
  
      }
  
      self.runParallax(el, animationData)
    },
  
  
    observeDOMChange: function(el, animationData){
      
      var self = this
  
      // Options for the observer (which mutations to observe)
      var config = { childList: true };
  
      // Callback function to execute when mutations are observed
      var callback = function(mutationsList) {
  
          var elChldrn = [].concat(self.functions.toConsumableArray(el.children))
  
          elChldrn.forEach((child, i) => {
            if(i >= animationData.animation.length) {
              child.style.visibility = 'hidden'
            }
          })
  
          if(animationData.observerTimeout) clearTimeout(animationData.observerTimeout)
  
          animationData['observerTimeout'] = setTimeout(function(){
          
            var childrenLengthDiff = el.children.length - animationData.childrenLength
  
            if(childrenLengthDiff > animationData.animationDelay.length) {
  
  
            } else {
  
              var elChildren = [].concat(self.functions.toConsumableArray(el.children))
  
              animationData['animationLazy'] = []
  
              elChildren.forEach((child, i) => {
  
                if(i >= animationData.animation.length) {
                  animationData['animationLazy'].push(TweenMax.from(child, animationData.duration, animationData.tweenAnimation))
                }
  
              })
  
              animationData['animationDelayLazy'] = animationData.animationDelay.slice(0, childrenLengthDiff)
  
              el.classList.remove('fz-active')
  
              self.runAnimation(el, animationData)
  
              var extendedAnimation = [].concat(self.functions.toConsumableArray(animationData.animation)).concat(animationData.animationLazy)
              var extendedAnimationDelay = [].concat(self.functions.toConsumableArray(animationData.animationDelay)).concat(animationData.animationDelayLazy.map((delay, j) => {
                return ((animationData.animationDelay[animationData.animationDelay.length - 1] - animationData.animationDelay[animationData.animationDelay.length - 2]) * (j + 1)) + animationData.animationDelay[animationData.animationDelay.length - 1]
              }))
  
              animationData.animation = extendedAnimation
              animationData.animationDelay = extendedAnimationDelay
  
              animationData.animationDelayLazy = null
              animationData.animationLazy = null
  
              elChildren.forEach((child) => {
                child.style.visibility = 'visible'
              })
  
            }
  
          }, 0)
  
      }
  
      // Create an observer instance linked to the callback function
      var observer = new MutationObserver(callback);
  
      // Start observing the target node for configured mutations
      observer.observe(el, config);
  
      // Later, you can stop observing
      // observer.disconnect();
    },

    process: function(el, rect,  opts) {
      
      var self = this
  
      self.animationProps = null
      self.tweenAnimation = {}
  
      if(!opts) opts = JSON.parse(el.getAttribute("fizzeroll"))
      
      //Define after animation props
  
      if(opts.delay) {
        self.animationDelay = opts.delay
      } else {
        self.animationDelay = 0
      }
  
      if(opts.movement) {
        if(typeof opts.movement[0]['min'] === 'number') {
  
          self.tweenAnimation['x'] = -(self.functions.getRandomInt(opts.movement[0]['min'], opts.movement[0]['max']))
          self.tweenAnimation['y'] = -(self.functions.getRandomInt(opts.movement[1]['min'], opts.movement[1]['max']))
          
        } else {
  
          self.tweenAnimation['x'] = -(opts.movement[0])
          self.tweenAnimation['y'] = -(opts.movement[1])
  
        }
        
      }

      if(opts.ease) {

        if(opts.ease[0] === 'Custom' || opts.ease[0] === 'CustomEase') {

          self.tweenAnimation['ease'] = CustomEase.create("custom", opts.ease[2])
          
        } else if(opts.ease[0] === 'Rough' || opts.ease[0] === 'RoughEase'){

          self.tweenAnimation['ease'] = RoughEase.ease.eval([opts.ease[2]])

        } else if(opts.ease[0] === 'SlowMo'){
          
          self.tweenAnimation['ease'] = RoughEase.ease.eval([opts.ease[2]])
          
        } else if(opts.ease[0] === 'Stepped' || opts.ease[0] === 'SteppedEase') {

          self.tweenAnimation['ease'] = SteppedEase.eval([opts.ease[2]])

        } else {

          if(opts.ease[2]) {

            self.tweenAnimation['ease'] = eval(opts.ease[0])[opts.ease[1]].eval([opts.ease[2]])
            
          } else {

            self.tweenAnimation['ease'] = eval(opts.ease[0])[opts.ease[1]]

          }
        }

      }

      if(opts.fade) {
        self.tweenAnimation['opacity'] = 0
      }
      
      if(opts.rotation) {
        self.tweenAnimation['rotation'] = opts.rotation
      }
  
      if(opts.scale && typeof opts.scale === 'number') {
        self.tweenAnimation['scale'] = opts.scale
      }
  
      if(opts.clip) {
        self.tweenAnimation['clip'] = opts.clip
      }
  
      self.tweenAnimation['onComplete'] = function(){
        el.classList.add('fz-done')
      }
  
      if(opts.allowMobile) {
        self.allowMobile = true
      } else {
        self.allowMobile = false
      }
      
      if(el.innerHTML.indexOf('</') > -1) {
        self.isTextElement = false
      } else {
        self.isTextElement = true
      }
  
      if(opts.offset) {
        self.triggerOffset = opts.offset
      } else {
        self.triggerOffset = 0
      }
  
      self.tweenAnimation['paused'] = true
  
      if(opts.type === 'stagger') {
  
        self.animation = []
  
        self.staggerDelay = []
  
        if(self.isTextElement) {
          
          self.splitTextHTML = ''
  
          if(opts.splitByWord) {
            el.innerText.split(' ').forEach((word) => {
              
              self.splitTextHTML += '<span style="display: inline-block">&nbsp</span>'
              self.splitTextHTML += '<span style="display: inline-block">' + word + '</span>'
              
            })
  
          } else {
  
            el.innerText.split('').forEach((letter) => {
              if(letter === ' ') {
                self.splitTextHTML += '<span style="display: inline-block">&nbsp</span>'
              } else {
                self.splitTextHTML += '<span style="display: inline-block">' + letter + '</span>'
              }
              
            })
  
          }
          
          
  
          el.innerHTML = self.splitTextHTML
  
          elChildren = [].concat(self.functions.toConsumableArray(el.children))
          
          elChildren.forEach((eachEl, j) => {
  
            self.staggerAnimation = null
            
            if(opts.delay) {
              self.animationDelay = opts.delay
            } else {
              self.animationDelay = 0
            }
  
            if (opts.staggerReverse) {
          
              self.animationDelay += (opts.staggerDelay * (elChildren.length - j - 1))
  
            } else {
  
              self.animationDelay += (opts.staggerDelay * j)
  
            }
            
            self.staggerDelay.push(self.animationDelay)
  
            self.staggerAnimation = TweenMax.from(elChildren[j], opts.duration, self.tweenAnimation)
  
            self.animation.push(self.staggerAnimation)
  
          })
  
          self.animationDelay = self.staggerDelay
  
        } else {
  
          elChildren = [].concat(self.functions.toConsumableArray(el.children))
          
          elChildren.forEach((eachEl, j) => {
  
            self.staggerAnimation = null
  
            if(opts.delay) {
              self.animationDelay = opts.delay
            } else {
              self.animationDelay = 0
            }
            
            self.animationDelay += (opts.staggerDelay * j)
            
            self.staggerDelay.push(self.animationDelay)
  
            self.staggerAnimation = TweenMax.from(el.children[j], opts.duration, self.tweenAnimation)
  
            self.animation.push(self.staggerAnimation)
  
          })
  
  
          self.animationDelay = self.staggerDelay
          
        }
      } else {
        
        self.animation = TweenMax.from(el, opts.duration, self.tweenAnimation)
  
      }
      
      self.animationData.push({
        animation: self.animation,
        tweenAnimation: self.tweenAnimation,
        animationDelay: self.animationDelay,
        fade: opts.fade, 
        type: opts.type, 
        duration: opts.duration, 
        playback: opts.playback,
        allowMobile: self.allowMobile,
        offset: self.triggerOffset,
        staggerReverse: opts.staggerReverse,
        parallax: opts.parallax,
        parallaxOffset: 0,
        rect: rect,
        delta: 0,
        reachedOffset: 0,
        parallaxInitialized: false,
        childrenLength: el.children.length,
        elIndex: self.animationData.length
      })
  
      self.functions.omitEmpty(self.animationData[self.animationData.length - 1])
  
      if(opts.type === 'stagger') {
        self.observeDOMChange(el, self.animationData[self.animationData.length - 1])
      }
        
      
    },

    reset: function(el, animationData, masterReset) {

      var self = this

      if(animationData.playback || masterReset) {
        
        if(el.className.indexOf('fz-active') > -1){
          if(animationData.staggerTimeout) {
            animationData.staggerTimeout.forEach((timeOut) => {
              clearTimeout(timeOut)
            })
          }
        }

        el.classList.remove('fz-active')
        el.classList.remove('fz-done')
        
        if(animationData.fade) {
          
          animationData.defaultOpacity = el.style.opacity
          
          if(el.children.length) {

            var elChildren = [].concat(self.functions.toConsumableArray(el.children))

            elChildren.forEach((child) => {
    
              child.style.opacity = 0

            })

          } else {

            el.style.opacity = 0

          }

        }
        
      }
    },

    masterReset: function(){
      var self = this
      self.fzElements.forEach((el, i) => {
        if(self.animationData[i]) self.reset(el, self.animationData[i], true)
      })
    },
  
    fizzeroll: function(self) {
      
      self.variables.fzElements.forEach((el, i) => {

          if(JSON.parse(el.getAttribute("fizzeroll")).allowMobile) {
              
              var rect = el.getBoundingClientRect();
              
              if(self.variables.animationData.length < self.variables.fzElements.length) {
        
                self.variables.process(el, rect)
        
              }
        
              if(self.variables.animationData[i].parallax) {
                self.variables.animationData[i].parallaxOffset = (window.innerHeight - el.getBoundingClientRect().y) * self.variables.animationData[i].parallax
              } 
        
        
              self.variables.checkIfInViewPort(el, self.variables.animationData[i], rect)

          } else {
              
              if(!self.variables.isMobile){

                  var rect = el.getBoundingClientRect();
                  
                  if(self.variables.animationData.length < self.variables.fzElements.length) {
            
                    self.variables.process(el, rect)
            
                  }
            
                  if(self.variables.animationData[i].parallax) {
                    self.variables.animationData[i].parallaxOffset = (window.innerHeight - el.getBoundingClientRect().y) * self.variables.animationData[i].parallax
                  } 
            
            
                  self.variables.checkIfInViewPort(el, self.variables.animationData[i], rect)

              }
          }
  
      })
      
    },
  
    runParallax: function(el, animationData) {
      
      var self = this
        
      animationData.delta += (animationData.rect.y - el.getBoundingClientRect().y) 
  
      animationData.rect.y = el.getBoundingClientRect().y   
  
      if(el.className.indexOf('fz-done') > -1) {
  
        if(animationData.parallaxOffset) {
  
          TweenMax.to(el, 0.3, {y: animationData.parallaxOffset, onComplete: function(){
            
            animationData.parallaxInitialized = true

          }})
  
          animationData.parallaxOffset = 0
  
        } else {
  
          if(animationData.parallaxInitialized) {
            
            TweenMax.to(el, 0.1, {y: animationData.delta * animationData.parallax})
          }
  
        }
  
      }    
    }
  },
  
  init: function() {
    var self = this
    
    self.variables.fzElements.forEach(function(el){
      if(el.className.indexOf('fz-active') > -1) {
        el.classList.remove('fz-active')
      }
    })

  //Initialize fizzeroll variables
  
    self.variables.fzElements = document.querySelectorAll('[fizzeroll]')
    self.variables.animationData = []
    self.variables.beforeAnimation = null;
    self.variables.tweenAnimation = null;
    self.variables.animationProps = null;
    self.variables.opts = null;
    self.variables.allowMobile = null;
    self.variables.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
    self.variables.isTextElement = null;
    self.variables.splitTextHTML = null;
    self.variables.inViewPort = null;
    self.variables.triggerOffset = null;
    self.variables.animation = null;
    self.variables.elChildren = null;
    self.variables.staggerAnimation = null;
    self.variables.staggerDelay = null;
    self.variables.scrollContainer = null;


    if(document.querySelector('[fizzeroll-container]')) self.variables.scrollContainer = document.querySelector('[fizzeroll-container]')
    
    if(!self.variables.scrollContainer || self.variables.scrollContainer.tagName === 'BODY') self.variables.scrollContainer = window


    self.variables.scrollContainer.removeEventListener('scroll', function(){
      self.variables.fizzeroll(self)
    })
    
    self.variables.scrollContainer.addEventListener('scroll', function(){
      self.variables.fizzeroll(self)
    })

    self.variables.fizzeroll(self)
  },
  apply: function(el, opts) {
    var self = this
    var test = [...self.variables.fzElements]
    var rect = el.getBoundingClientRect()
    test.push(el)
    self.variables.fzElements = test
    self.variables.process(el, rect, opts)
    self.variables.checkIfInViewPort(el, self.variables.animationData[animationData.length - 1], rect)
  },
  masterReset: function(){
    var self = this
    self.variables.fzElements.forEach((el, i) => {
      if(self.variables.animationData[i]) self.variables.reset(el, self.variables.animationData[i], true)
    })
  }
}