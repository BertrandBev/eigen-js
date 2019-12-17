<template lang="pug">
div(style='display: flex; align-items: center')
  div(style='width: 256px;')
    div.white--text(v-katex='expression')
  div(ref='canvas')
</template>

<script>
import Two from "two.js";
import eig from "@eigen/eigen.js";
import { getTex } from "@/components/texUtils.js";
import anime from "animejs";
import _ from "lodash";

export default {
  data: () => ({
    size: [384, 384],
    matrix: null,
    timeout: null,
    two: null,
    graphics: {}
  }),

  computed: {
    expression() {
      if (this.matrix) {
        const tex = getTex(this.matrix);
        return `\\Large ${tex}`;
      } else {
        return "";
      }
    }
  },

  mounted() {
    // Setup canvas
    const [w, h] = this.size;
    this.two = new Two({ width: w, height: h }).appendTo(this.$refs.canvas);

    // Build frame
    const xAxis = this.two.makeLine(-w / 2, 0, w / 2, 0);
    const yAxis = this.two.makeLine(0, -h / 2, 0, h / 2);
    xAxis.stroke = "white";
    yAxis.stroke = "white";
    xAxis.linewidth = 2;
    yAxis.linewidth = 2;
    const frame = this.two.makeGroup(xAxis, yAxis);
    frame.translation.set(w / 2, h / 2);

    // Build Ellipse
    const dim = w / 4;
    const ellipse = this.two.makeEllipse(0, 0, dim, 2 * dim);
    ellipse.fill = "rgba(255, 255, 255, 0.90)";
    ellipse.translation.set(w / 2, h / 2);
    ellipse.stroke = '#004c3f'
    this.graphics.ellipse = ellipse;

    // Build inner frame
    const sig1 = this.two.makeLine(0, 0, dim, 0);
    const sig2 = this.two.makeLine(0, 0, 0, 2 * dim);
    sig1.linewidth = sig2.linewidth = 2;
    sig1.stroke = sig2.stroke = '#004c3f'
    this.graphics.frame = {
      sig1,
      sig2,
      group: this.two.makeGroup(sig1, sig2)
    };
    this.graphics.frame.group.translation.set(w / 2, h / 2);

    // Start loop
    this.loop();
  },

  destroyed() {
    if (this.timeout) clearTimeout(this.timeout);
  },

  methods: {
    loop() {
      this.genMatrix();
      const g = this.graphics;
      const svd = this.getSvd();
      const theta = Math.atan2(svd.U.get(1, 0), svd.U.get(0, 0));
      const [s1, s2] = [svd.sv.vGet(0), svd.sv.vGet(1)];
      const dim = this.size[0] / 4;

      anime({
        targets: g.ellipse,
        width: dim * s1,
        height: dim * s2,
        rotation: theta,
        round: 1000,
        // easing: "linear",
        duration: 2000,
        update: () => {
          // console.log('g', g.frame)
          g.frame.sig1.vertices[1].x = g.ellipse.width / 2;
          g.frame.sig2.vertices[1].y = g.ellipse.height / 2;
          g.frame.group.rotation = g.ellipse.rotation;
          this.two.update();
        }
      });

      this.timeout = setTimeout(this.loop, 3000);
    },

    genMatrix() {
      const theta = Math.PI * 2 * Math.random() - Math.PI + Math.PI;
      const R = eig.Matrix.fromArray([
        [Math.cos(theta), -Math.sin(theta)],
        [Math.sin(theta), Math.cos(theta)]
      ]);
      const s1 = 3 * Math.random() + 0.7;
      const s2 = 3 * Math.random() + 0.7;
      const diag = eig.Matrix.fromArray([s1, s2]);
      const D = eig.Matrix.diagonal(diag);
      const mat = R.matMul(D);
      this.matrix = mat;
    },

    getSvd() {
      return eig.Decompositions.svd(this.matrix, false);
    }
  }
};
</script>