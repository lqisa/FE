# Emmet

[TOC]



# Abbreviations Syntax 缩写语法

## elements

```
div` → `<div></div>
foo → <foo></foo>
```

## Nesting operators 嵌套运算符

### Child: `>`

```html
div>ul>li

<div>
    <ul>
        <li></li>
    </ul>
</div>
```

#### Sibling: `+`

```
div+p+bq

<div></div>
<p></p>
<blockquote></blockquote>
```

#### Climb-up: `^`

>  climb one level up the tree

```
div+div>p>span+em^bq

<div></div>
<div>
    <p><span></span><em></em></p>
    <blockquote></blockquote>
</div>
```

- use as many `^` operators as you like

```
div+div>p>span+em^^^^^^^^^bq

<div></div>
<div>
    <p><span></span><em></em></p>
</div>
<blockquote></blockquote>
```

#### Multiplication: `*`

```
ul>li*5

<ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
</ul>
```

### Grouping: `()`

```
div>(header>ul>li*2>a)+footer>p

<div>
    <header>
        <ul>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
        </ul>
    </header>
    <footer>
        <p></p>
    </footer>
</div>
```

## Attribute operators 属性运算符

### ID and CLASS 身份和类别

```
div#header+div.page+div#footer.class1.class2.class3

<div id="header"></div>
<div class="page"></div>
<div id="footer" class="class1 class2 class3"></div>
```

### Custom attributes 自定义属性

```
td[title="Hello world!" colspan=3]
<td title="Hello world!" colspan="3"></td>
```

- 可以在方括号内放置任意数量的属性
- **不必指定属性值**： `td[colspan title]`将生成`<td colspan="" title="">` 每个空属性内都带有制表符（如果您的编辑器支持它们）
- 属性值可以是单引号或者双引号，没有空格时无需引号
  - `td[title="Hello world!" colspan=3]`
  - `td[title=‘Hello world!’ colspan=3]`
  - `td[title=hello colspan=3]`

### Item numbering: `$`

使用乘法`*`运算符可以重复元素，但使用`$`可以对它们*进行编号*。将`$`运算符*放在元素名称、属性名称或属性值内*以输出当前重复元素的数量：

```
ul>li.item$*5

<ul>
    <li class="item1"></li>
    <li class="item2"></li>
    <li class="item3"></li>
    <li class="item4"></li>
    <li class="item5"></li>
</ul>

// 连续使用多个$用零填充数字
ul>li.item$$$*5

<ul>
    <li class="item001"></li>
    <li class="item002"></li>
    <li class="item003"></li>
    <li class="item004"></li>
    <li class="item005"></li>
</ul>
```

#### 更改编号基数和方向

使用`@`修饰符，您可以更改编号方向（升序或降序）和基数（例如起始值）

- 改变方向，请在`$`之后添加`@-`

  ```
  ul>li.item$@-*5
  
  <ul>
      <li class="item5"></li>
      <li class="item4"></li>
      <li class="item3"></li>
      <li class="item2"></li>
      <li class="item1"></li>
  </ul>
  ```

- 要更改计数器基值，请将`@N`修饰符添加到`$`

  ```
  ul>li.item$@3*5
  <ul>
      <li class="item3"></li>
      <li class="item4"></li>
      <li class="item5"></li>
      <li class="item6"></li>
      <li class="item7"></li>
  </ul>
  ```

- 您可以一起使用这些修饰符：

  ```
  ul>li.item$@-3*5
  
  <ul>
      <li class="item7"></li>
      <li class="item6"></li>
      <li class="item5"></li>
      <li class="item4"></li>
      <li class="item3"></li>
  </ul>
  ```

##  Text: `{}`

使用花括号将文本添加到元素

```
a{Click me}

<a href="">Click me</a>
```



空格是一个*停止符号*，Emmet 会在此处停止缩写解析

```
// NOT WORK
(header > ul.nav > li*5) + footer
```



# CSS Abbreviations CSS 缩写

```
m10 → margin:10px
m10-20 → margin: 10px 20px
m-10--20 → margin: -10px -20px

```

##  Supplying values with units 提供带单位的值

- 默认是 px
- 浮点数，则会以`em`单位输出： `m1.5` → `margin: 1.5em`
- 显式提供单位：m1.5ex` → `margin: 1.5ex;` , `m10foo` → `margin: 10foo
- **显式定义单位，不再需要使用连字符**: `m10ex20em` → `margin: 10ex 20em;` , `m10ex-5` → `margin: 10ex -5px`

## Value aliases 值别名

- `p` → `%`
- `e` → `em`
- `x` → `ex`

```
w100p → width: 100%
m10p30e5x → margin: 10% 30em 5ex
```

## Color values 颜色值

- `#1` → `#111111`
- `#e0` → `#e0e0e0`
- `#fc0` → `#ffcc00`

## Unit-less properties 无单位属性

- `z-index` 
- `line-height` 
- `opacity`
- `font-weight`

```
lh2 → line-height: 2
fw400 → font-weight: 400
```

## !important modifier 

```
p!+m10e!

padding:  !important;
margin: 10em !important;
```

