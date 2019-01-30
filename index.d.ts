import HUI from "./typings/index";

export as namespace HUI;

declare global {

    namespace JSX {

        interface ElementChildrenAttribute {
            children: {};
        }

        interface IntrinsicElements {

            [name: string]: HUI.EleProps<any>;

            a: HUI.EleProps<HTMLAnchorElement>;
            abbr: HUI.EleProps<HTMLElement>;
            address: HUI.EleProps<HTMLElement>;
            area: HUI.EleProps<HTMLAreaElement>;
            article: HUI.EleProps<HTMLElement>;
            aside: HUI.EleProps<HTMLElement>;
            audio: HUI.EleProps<HTMLAudioElement>;
            b: HUI.EleProps<HTMLElement>;
            base: HUI.EleProps<HTMLBaseElement>;
            bdi: HUI.EleProps<HTMLElement>;
            bdo: HUI.EleProps<HTMLElement>;
            big: HUI.EleProps<HTMLElement>;
            blockquote: HUI.EleProps<HTMLElement>;
            body: HUI.EleProps<HTMLBodyElement>;
            br: HUI.EleProps<HTMLBRElement>;
            button: HUI.EleProps<HTMLButtonElement>;
            canvas: HUI.EleProps<HTMLCanvasElement>;
            caption: HUI.EleProps<HTMLElement>;
            cite: HUI.EleProps<HTMLElement>;
            code: HUI.EleProps<HTMLElement>;
            col: HUI.EleProps<HTMLTableColElement>;
            colgroup: HUI.EleProps<HTMLTableColElement>;
            data: HUI.EleProps<HTMLElement>;
            datalist: HUI.EleProps<HTMLDataListElement>;
            dd: HUI.EleProps<HTMLElement>;
            del: HUI.EleProps<HTMLElement>;
            details: HUI.EleProps<HTMLElement>;
            dfn: HUI.EleProps<HTMLElement>;
            dialog: HUI.EleProps<HTMLDialogElement>;
            div: HUI.EleProps<HTMLDivElement>;
            dl: HUI.EleProps<HTMLDListElement>;
            dt: HUI.EleProps<HTMLElement>;
            em: HUI.EleProps<HTMLElement>;
            embed: HUI.EleProps<HTMLEmbedElement>;
            fieldset: HUI.EleProps<HTMLFieldSetElement>;
            figcaption: HUI.EleProps<HTMLElement>;
            figure: HUI.EleProps<HTMLElement>;
            footer: HUI.EleProps<HTMLElement>;
            form: HUI.EleProps<HTMLFormElement>;
            h1: HUI.EleProps<HTMLHeadingElement>;
            h2: HUI.EleProps<HTMLHeadingElement>;
            h3: HUI.EleProps<HTMLHeadingElement>;
            h4: HUI.EleProps<HTMLHeadingElement>;
            h5: HUI.EleProps<HTMLHeadingElement>;
            h6: HUI.EleProps<HTMLHeadingElement>;
            head: HUI.EleProps<HTMLHeadElement>;
            header: HUI.EleProps<HTMLElement>;
            hgroup: HUI.EleProps<HTMLElement>;
            hr: HUI.EleProps<HTMLHRElement>;
            html: HUI.EleProps<HTMLHtmlElement>;
            i: HUI.EleProps<HTMLElement>;
            iframe: HUI.EleProps<HTMLIFrameElement>;
            img: HUI.EleProps<HTMLImageElement>;
            input: HUI.EleProps<HTMLInputElement>;
            ins: HUI.EleProps<HTMLModElement>;
            kbd: HUI.EleProps<HTMLElement>;
            keygen: HUI.EleProps<HTMLElement>;
            label: HUI.EleProps<HTMLLabelElement>;
            legend: HUI.EleProps<HTMLLegendElement>;
            li: HUI.EleProps<HTMLLIElement>;
            link: HUI.EleProps<HTMLLinkElement>;
            main: HUI.EleProps<HTMLElement>;
            map: HUI.EleProps<HTMLMapElement>;
            mark: HUI.EleProps<HTMLElement>;
            menu: HUI.EleProps<HTMLElement>;
            menuitem: HUI.EleProps<HTMLElement>;
            meta: HUI.EleProps<HTMLMetaElement>;
            meter: HUI.EleProps<HTMLElement>;
            nav: HUI.EleProps<HTMLElement>;
            noindex: HUI.EleProps<HTMLElement>;
            noscript: HUI.EleProps<HTMLElement>;
            object: HUI.EleProps<HTMLObjectElement>;
            ol: HUI.EleProps<HTMLOListElement>;
            optgroup: HUI.EleProps<HTMLOptGroupElement>;
            option: HUI.EleProps<HTMLOptionElement>;
            output: HUI.EleProps<HTMLElement>;
            p: HUI.EleProps<HTMLParagraphElement>;
            param: HUI.EleProps<HTMLParamElement>;
            picture: HUI.EleProps<HTMLElement>;
            pre: HUI.EleProps<HTMLPreElement>;
            progress: HUI.EleProps<HTMLProgressElement>;
            q: HUI.EleProps<HTMLQuoteElement>;
            rp: HUI.EleProps<HTMLElement>;
            rt: HUI.EleProps<HTMLElement>;
            ruby: HUI.EleProps<HTMLElement>;
            s: HUI.EleProps<HTMLElement>;
            samp: HUI.EleProps<HTMLElement>;
            script: HUI.EleProps<HTMLScriptElement>;
            section: HUI.EleProps<HTMLElement>;
            select: HUI.EleProps<HTMLSelectElement>;
            small: HUI.EleProps<HTMLElement>;
            source: HUI.EleProps<HTMLSourceElement>;
            span: HUI.EleProps<HTMLSpanElement>;
            strong: HUI.EleProps<HTMLElement>;
            style: HUI.EleProps<HTMLStyleElement>;
            sub: HUI.EleProps<HTMLElement>;
            summary: HUI.EleProps<HTMLElement>;
            sup: HUI.EleProps<HTMLElement>;
            table: HUI.EleProps<HTMLTableElement>;
            tbody: HUI.EleProps<HTMLTableSectionElement>;
            td: HUI.EleProps<HTMLTableDataCellElement>;
            textarea: HUI.EleProps<HTMLTextAreaElement>;
            tfoot: HUI.EleProps<HTMLTableSectionElement>;
            th: HUI.EleProps<HTMLTableHeaderCellElement>;
            thead: HUI.EleProps<HTMLTableSectionElement>;
            time: HUI.EleProps<HTMLElement>;
            title: HUI.EleProps<HTMLTitleElement>;
            tr: HUI.EleProps<HTMLTableRowElement>;
            track: HUI.EleProps<HTMLTrackElement>;
            u: HUI.EleProps<HTMLElement>;
            ul: HUI.EleProps<HTMLUListElement>;
            var: HUI.EleProps<HTMLElement>;
            video: HUI.EleProps<HTMLVideoElement>;
            wbr: HUI.EleProps<HTMLElement>;
            webview: HUI.EleProps<HTMLElement>;

            svg: HUI.EleProps<SVGSVGElement>;
            animate: HUI.EleProps<SVGAnimateElement>;
            animateTransform: HUI.EleProps<SVGAnimateTransformElement>;
            circle: HUI.EleProps<SVGCircleElement>;
            clipPath: HUI.EleProps<SVGClipPathElement>;
            defs: HUI.EleProps<SVGDefsElement>;
            desc: HUI.EleProps<SVGDescElement>;
            ellipse: HUI.EleProps<SVGEllipseElement>;
            feBlend: HUI.EleProps<SVGFEBlendElement>;
            feColorMatrix: HUI.EleProps<SVGFEColorMatrixElement>;
            feComponentTransfer: HUI.EleProps<SVGFEComponentTransferElement>;
            feComposite: HUI.EleProps<SVGFECompositeElement>;
            feConvolveMatrix: HUI.EleProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: HUI.EleProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: HUI.EleProps<SVGFEDisplacementMapElement>;
            feDistantLight: HUI.EleProps<SVGFEDistantLightElement>;
            feFlood: HUI.EleProps<SVGFEFloodElement>;
            feFuncA: HUI.EleProps<SVGFEFuncAElement>;
            feFuncB: HUI.EleProps<SVGFEFuncBElement>;
            feFuncG: HUI.EleProps<SVGFEFuncGElement>;
            feFuncR: HUI.EleProps<SVGFEFuncRElement>;
            feGaussianBlur: HUI.EleProps<SVGFEGaussianBlurElement>;
            feImage: HUI.EleProps<SVGFEImageElement>;
            feMerge: HUI.EleProps<SVGFEMergeElement>;
            feMergeNode: HUI.EleProps<SVGFEMergeNodeElement>;
            feMorphology: HUI.EleProps<SVGFEMorphologyElement>;
            feOffset: HUI.EleProps<SVGFEOffsetElement>;
            fePointLight: HUI.EleProps<SVGFEPointLightElement>;
            feSpecularLighting: HUI.EleProps<SVGFESpecularLightingElement>;
            feSpotLight: HUI.EleProps<SVGFESpotLightElement>;
            feTile: HUI.EleProps<SVGFETileElement>;
            feTurbulence: HUI.EleProps<SVGFETurbulenceElement>;
            filter: HUI.EleProps<SVGFilterElement>;
            foreignObject: HUI.EleProps<SVGForeignObjectElement>;
            g: HUI.EleProps<SVGGElement>;
            image: HUI.EleProps<SVGImageElement>;
            line: HUI.EleProps<SVGLineElement>;
            linearGradient: HUI.EleProps<SVGLinearGradientElement>;
            marker: HUI.EleProps<SVGMarkerElement>;
            mask: HUI.EleProps<SVGMaskElement>;
            metadata: HUI.EleProps<SVGMetadataElement>;
            path: HUI.EleProps<SVGPathElement>;
            pattern: HUI.EleProps<SVGPatternElement>;
            polygon: HUI.EleProps<SVGPolygonElement>;
            polyline: HUI.EleProps<SVGPolylineElement>;
            radialGradient: HUI.EleProps<SVGRadialGradientElement>;
            rect: HUI.EleProps<SVGRectElement>;
            stop: HUI.EleProps<SVGStopElement>;
            switch: HUI.EleProps<SVGSwitchElement>;
            symbol: HUI.EleProps<SVGSymbolElement>;
            text: HUI.EleProps<SVGTextElement>;
            textPath: HUI.EleProps<SVGTextPathElement>;
            tspan: HUI.EleProps<SVGTSpanElement>;
            use: HUI.EleProps<SVGUseElement>;
            view: HUI.EleProps<SVGViewElement>;

        }

    }

}

export = HUI;
