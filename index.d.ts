import HUI from "./typings/index";
import { EleProps } from "./typings/core/propHandlers";

export as namespace HUI;

declare global {

    namespace JSX {

        interface ElementChildrenAttribute {
            children: {};
        }

        interface IntrinsicElements {

            [name: string]: EleProps<any>;

            a: EleProps<HTMLAnchorElement>;
            abbr: EleProps<HTMLElement>;
            address: EleProps<HTMLElement>;
            area: EleProps<HTMLAreaElement>;
            article: EleProps<HTMLElement>;
            aside: EleProps<HTMLElement>;
            audio: EleProps<HTMLAudioElement>;
            b: EleProps<HTMLElement>;
            base: EleProps<HTMLBaseElement>;
            bdi: EleProps<HTMLElement>;
            bdo: EleProps<HTMLElement>;
            big: EleProps<HTMLElement>;
            blockquote: EleProps<HTMLElement>;
            body: EleProps<HTMLBodyElement>;
            br: EleProps<HTMLBRElement>;
            button: EleProps<HTMLButtonElement>;
            canvas: EleProps<HTMLCanvasElement>;
            caption: EleProps<HTMLElement>;
            cite: EleProps<HTMLElement>;
            code: EleProps<HTMLElement>;
            col: EleProps<HTMLTableColElement>;
            colgroup: EleProps<HTMLTableColElement>;
            data: EleProps<HTMLElement>;
            datalist: EleProps<HTMLDataListElement>;
            dd: EleProps<HTMLElement>;
            del: EleProps<HTMLElement>;
            details: EleProps<HTMLElement>;
            dfn: EleProps<HTMLElement>;
            dialog: EleProps<HTMLDialogElement>;
            div: EleProps<HTMLDivElement>;
            dl: EleProps<HTMLDListElement>;
            dt: EleProps<HTMLElement>;
            em: EleProps<HTMLElement>;
            embed: EleProps<HTMLEmbedElement>;
            fieldset: EleProps<HTMLFieldSetElement>;
            figcaption: EleProps<HTMLElement>;
            figure: EleProps<HTMLElement>;
            footer: EleProps<HTMLElement>;
            form: EleProps<HTMLFormElement>;
            h1: EleProps<HTMLHeadingElement>;
            h2: EleProps<HTMLHeadingElement>;
            h3: EleProps<HTMLHeadingElement>;
            h4: EleProps<HTMLHeadingElement>;
            h5: EleProps<HTMLHeadingElement>;
            h6: EleProps<HTMLHeadingElement>;
            head: EleProps<HTMLHeadElement>;
            header: EleProps<HTMLElement>;
            hgroup: EleProps<HTMLElement>;
            hr: EleProps<HTMLHRElement>;
            html: EleProps<HTMLHtmlElement>;
            i: EleProps<HTMLElement>;
            iframe: EleProps<HTMLIFrameElement>;
            img: EleProps<HTMLImageElement>;
            input: EleProps<HTMLInputElement>;
            ins: EleProps<HTMLModElement>;
            kbd: EleProps<HTMLElement>;
            keygen: EleProps<HTMLElement>;
            label: EleProps<HTMLLabelElement>;
            legend: EleProps<HTMLLegendElement>;
            li: EleProps<HTMLLIElement>;
            link: EleProps<HTMLLinkElement>;
            main: EleProps<HTMLElement>;
            map: EleProps<HTMLMapElement>;
            mark: EleProps<HTMLElement>;
            menu: EleProps<HTMLElement>;
            menuitem: EleProps<HTMLElement>;
            meta: EleProps<HTMLMetaElement>;
            meter: EleProps<HTMLElement>;
            nav: EleProps<HTMLElement>;
            noindex: EleProps<HTMLElement>;
            noscript: EleProps<HTMLElement>;
            object: EleProps<HTMLObjectElement>;
            ol: EleProps<HTMLOListElement>;
            optgroup: EleProps<HTMLOptGroupElement>;
            option: EleProps<HTMLOptionElement>;
            output: EleProps<HTMLElement>;
            p: EleProps<HTMLParagraphElement>;
            param: EleProps<HTMLParamElement>;
            picture: EleProps<HTMLElement>;
            pre: EleProps<HTMLPreElement>;
            progress: EleProps<HTMLProgressElement>;
            q: EleProps<HTMLQuoteElement>;
            rp: EleProps<HTMLElement>;
            rt: EleProps<HTMLElement>;
            ruby: EleProps<HTMLElement>;
            s: EleProps<HTMLElement>;
            samp: EleProps<HTMLElement>;
            script: EleProps<HTMLScriptElement>;
            section: EleProps<HTMLElement>;
            select: EleProps<HTMLSelectElement>;
            small: EleProps<HTMLElement>;
            source: EleProps<HTMLSourceElement>;
            span: EleProps<HTMLSpanElement>;
            strong: EleProps<HTMLElement>;
            style: EleProps<HTMLStyleElement>;
            sub: EleProps<HTMLElement>;
            summary: EleProps<HTMLElement>;
            sup: EleProps<HTMLElement>;
            table: EleProps<HTMLTableElement>;
            tbody: EleProps<HTMLTableSectionElement>;
            td: EleProps<HTMLTableDataCellElement>;
            textarea: EleProps<HTMLTextAreaElement>;
            tfoot: EleProps<HTMLTableSectionElement>;
            th: EleProps<HTMLTableHeaderCellElement>;
            thead: EleProps<HTMLTableSectionElement>;
            time: EleProps<HTMLElement>;
            title: EleProps<HTMLTitleElement>;
            tr: EleProps<HTMLTableRowElement>;
            track: EleProps<HTMLTrackElement>;
            u: EleProps<HTMLElement>;
            ul: EleProps<HTMLUListElement>;
            var: EleProps<HTMLElement>;
            video: EleProps<HTMLVideoElement>;
            wbr: EleProps<HTMLElement>;
            webview: EleProps<HTMLElement>;

            svg: EleProps<SVGSVGElement>;
            animate: EleProps<SVGAnimateElement>;
            animateTransform: EleProps<SVGAnimateTransformElement>;
            circle: EleProps<SVGCircleElement>;
            clipPath: EleProps<SVGClipPathElement>;
            defs: EleProps<SVGDefsElement>;
            desc: EleProps<SVGDescElement>;
            ellipse: EleProps<SVGEllipseElement>;
            feBlend: EleProps<SVGFEBlendElement>;
            feColorMatrix: EleProps<SVGFEColorMatrixElement>;
            feComponentTransfer: EleProps<SVGFEComponentTransferElement>;
            feComposite: EleProps<SVGFECompositeElement>;
            feConvolveMatrix: EleProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: EleProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: EleProps<SVGFEDisplacementMapElement>;
            feDistantLight: EleProps<SVGFEDistantLightElement>;
            feFlood: EleProps<SVGFEFloodElement>;
            feFuncA: EleProps<SVGFEFuncAElement>;
            feFuncB: EleProps<SVGFEFuncBElement>;
            feFuncG: EleProps<SVGFEFuncGElement>;
            feFuncR: EleProps<SVGFEFuncRElement>;
            feGaussianBlur: EleProps<SVGFEGaussianBlurElement>;
            feImage: EleProps<SVGFEImageElement>;
            feMerge: EleProps<SVGFEMergeElement>;
            feMergeNode: EleProps<SVGFEMergeNodeElement>;
            feMorphology: EleProps<SVGFEMorphologyElement>;
            feOffset: EleProps<SVGFEOffsetElement>;
            fePointLight: EleProps<SVGFEPointLightElement>;
            feSpecularLighting: EleProps<SVGFESpecularLightingElement>;
            feSpotLight: EleProps<SVGFESpotLightElement>;
            feTile: EleProps<SVGFETileElement>;
            feTurbulence: EleProps<SVGFETurbulenceElement>;
            filter: EleProps<SVGFilterElement>;
            foreignObject: EleProps<SVGForeignObjectElement>;
            g: EleProps<SVGGElement>;
            image: EleProps<SVGImageElement>;
            line: EleProps<SVGLineElement>;
            linearGradient: EleProps<SVGLinearGradientElement>;
            marker: EleProps<SVGMarkerElement>;
            mask: EleProps<SVGMaskElement>;
            metadata: EleProps<SVGMetadataElement>;
            path: EleProps<SVGPathElement>;
            pattern: EleProps<SVGPatternElement>;
            polygon: EleProps<SVGPolygonElement>;
            polyline: EleProps<SVGPolylineElement>;
            radialGradient: EleProps<SVGRadialGradientElement>;
            rect: EleProps<SVGRectElement>;
            stop: EleProps<SVGStopElement>;
            switch: EleProps<SVGSwitchElement>;
            symbol: EleProps<SVGSymbolElement>;
            text: EleProps<SVGTextElement>;
            textPath: EleProps<SVGTextPathElement>;
            tspan: EleProps<SVGTSpanElement>;
            use: EleProps<SVGUseElement>;
            view: EleProps<SVGViewElement>;

        }

    }

}

export = HUI;
