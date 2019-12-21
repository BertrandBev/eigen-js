<template lang="pug">
div(:style='layoutStyle')
  div(:style='expStyle')
    span.white--text.font-weight-light.headline SVD
    div.white--text(v-katex='expression')
  div(ref='canvas')
</template>

<script>
import Two from "two.js";
import eig from "@eigen";
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
    expStyle() {
      return {
        display: "flex",
        "align-items": "center",
        width: this.largeScreen ? "300px" : ""
      };
    },

    layoutStyle() {
      return {
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "flex-direction": this.largeScreen ? "row" : "column"
      };
    },

    largeScreen() {
      return this.$store.windowSize.x > 768;
    },

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
    ellipse.stroke = "#004c3f";
    this.graphics.ellipse = ellipse;

    // Build inner frame
    const sig1 = this.two.makeLine(0, 0, dim, 0);
    const sig2 = this.two.makeLine(0, 0, 0, 2 * dim);
    sig1.linewidth = sig2.linewidth = 2;
    sig1.stroke = sig2.stroke = "#004c3f";
    const s1 = this.two.makeText("σ1", 0, 0);
    const s2 = this.two.makeText("σ2", 0, 0);
    s1.size = s2.size = 18;
    s1.fill = s2.fill = "white";
    this.graphics.frame = {
      sig1,
      sig2,
      s1,
      s2,
      group: this.two.makeGroup(sig1, sig2)
    };
    this.graphics.frame.group.translation.set(w / 2, h / 2);

    // Build text

    // Start loop
    this.loop();
  },

  destroyed() {
    if (this.timeout) clearTimeout(this.timeout);
  },

  methods: {
    loop() {
      const [w, h] = this.size;
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
          const [cr, sr] = [
            Math.cos(g.ellipse.rotation),
            Math.sin(g.ellipse.rotation)
          ];
          g.frame.s1.translation.set(
            w / 2 + (g.ellipse.width / 2 + 18) * cr,
            w / 2 + (g.ellipse.width / 2 + 18) * sr
          );
          g.frame.s2.translation.set(
            w / 2 - (g.ellipse.height / 2 + 18) * sr,
            w / 2 + (g.ellipse.height / 2 + 18) * cr
          );
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
      const s1 = 2.8 * Math.random() + 0.7;
      const s2 = 2.8 * Math.random() + 0.7;
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