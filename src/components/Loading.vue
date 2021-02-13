<template>
  <div class="load-wrapper">
    <div class="row cf">
      <div class="span">
        <div class="eye"></div>
      </div>
      <p class="msg">正在加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.cf:before,
.cf:after {
  content: " ";
  /* 1 */
  display: table;
  /* 2 */
}

.cf:after {
  clear: both;
}

html {
  color: #000;
  font-family: "Source Sans Pro", sans-serif;
}

::-moz-selection {
  background: #fff;
  text-shadow: none;
}

::selection {
  background: #fff;
  text-shadow: none;
}

.load-wrapper {
  position: fixed;
  top: calc(50% - 110px);
  left: calc(50% - 50px);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.msg {
  font-weight: bold;
}
.row {
  text-align: center;
  padding: 50px 0;
}

.span,
.span_large {
  float: left;
  width: 100px;
  overflow: hidden;
  background-color: #000;
  height: 100px;
  vertical-align: middle;
  border-radius: 15px;
}

/*eye ball*/
.eye {
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 30px 0px 0px 0px #fff;
  position: relative;
  margin: 36px 26px;
}

.eye:after {
  background-color: #000;
  width: 10px;
  height: 10px;
  box-shadow: 30px 0px 0px 0px #000;
  border-radius: 50%;
  left: 9px;
  top: 8px;
  position: absolute;
  content: "";
  -webkit-animation: eyeball 2s linear infinite alternate;
  -moz-animation: eyeball 2s linear infinite alternate;
  animation: eyeball 2s linear infinite alternate;
}

@-webkit-keyframes eyeball {
  0% {
    left: 9px;
  }

  100% {
    left: 1px;
  }
}

@-moz-keyframes eyeball {
  0% {
    left: 9px;
  }

  100% {
    left: 1px;
  }
}

@keyframes eyeball {
  0% {
    left: 9px;
  }

  100% {
    left: 1px;
  }
}
</style>