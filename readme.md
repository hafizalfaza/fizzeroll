# Fizzeroll - Ultimate On Scroll Animation Library

Easily animate your HTML elements on scroll. This library was built on top of GSAP animation library.

### Installing

CDN

```
<body>
...
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js"></script>
<script src="https://unpkg.com/fizzeroll/umd/fizzeroll.min.js"></script>
...
</body>
```

*Make sure to include GSAP before including this library, as shown above





If you are using node modules:
```
npm i fizzeroll
```

## Usage

Example of how to configure and initialize animation

React:

```
import Fizzeroll from 'fizzeroll'

class App extends Component {

  componentDidMount(){
    Fizzeroll.init()
  }

  render() {
    <div>
      <div fizzeroll='{"duration": 0.5, "movement": [100, -100], "fade": true, "ease": ["Power2", "easeOut"]}'></div>
    </div>
  }

}
```

If you want to reset the animation on scroll top set 'fizzeroll-top-reset' as attribute on body tag

example:

```
  <body fizzeroll-top-reset>
  ...
  </body>

```


To apply animation on JavaScript:

```

  Fizzeroll.apply(element, configurations)

```


example:

```

  Fizzeroll.apply(document.getElementById('animationEl'), {duration: 0.5, movement: [100, -100], fade: true, ease: ["Power2", "easeOut"]})

```


This library also supports stagger animation, simply set the configuration on parent element, all children will be automatically animated in stagger fashion

example: 

```
    <div fizzeroll='{"duration": 0.5, "movement": [100, -100], "fade": true, "ease": ["Power2", "easeOut"], "type": "stagger", "staggerDelay": 0.2}'>

      <div>I AM ANIMATED CHILD</div>
      <div>I AM ANIMATED CHILD</div>
      <div>I AM ANIMATED CHILD</div>
      <div>I AM ANIMATED CHILD</div>

    </div>
```


Stagger animation can be implemented with text element, text will be automatically split into letters and animated

example:

```
  <p fizzeroll='{"duration": 0.5, "movement": [100, -100], "fade": true, "ease":    ["Power2", "easeOut"], "type": "stagger", "staggerDelay": 0.2}'>
    THIS TEXT IS SPLIT INTO LETTERS AND ANIMATED
  </p>
```

if you want to split the text by word, add {"splitByWord": true}

example:

```
  <p fizzeroll='{"duration": 0.5, "movement": [100, -100], "fade": true, "ease":    ["Power2", "easeOut"], "type": "stagger", "staggerDelay": 0.2, "splitByWord": true}'>
    THIS TEXT IS SPLIT INTO WORDS AND ANIMATED
  </p>
```


### Animation Parameters

Key | Value Type | Example | Description
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |--- |---
duration | Number | 0.5 | How long it takes for animation to finish | 
movement | Number[] ([x, y]) | [100, -100] | Direction of animation defined in X and Y |
fade | Boolean (true / false) | true | Whether the element is fading from 0 to its original opacity |
scale | Number | 0.5 | Whether the element is scaling to its original scale |
type | String | "stagger" | Type of animation |
splitByWord | Boolean (true / false) | true | Whether stagger animation split text by word|
ease | String[] ([name, style, config]) | ['Elastic', 'easeOut', 'config(1, 0.3)'] | Ease style (Check GSAP website for more ease style) |
allowMobile | Boolean (true / false) | true | Whether animation runs on mobile |
delay | Number | 2 | How long it takes before animation starts after activation |
offset | Number | 200 | How far it takes (scroll) before animation is activated |
staggerDelay | Number | 0.2 | How long it takes between staggered child |
playback | Boolean | true | Whether animation replays after element is below the viewport and then back in the viewport |
parallax | Number | 1 | How fast the element moves in parallax fashion as user scrolls |

## Author

* **Hafiz Al Faza** - https://github.com/hafizalfaza

## License

This project is licensed under the MIT License