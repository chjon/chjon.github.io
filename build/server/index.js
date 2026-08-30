import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { marked } from "marked";
import { useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
	}
];
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function App() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack;
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "pt-16 p-4 container mx-auto",
		children: [
			/* @__PURE__ */ jsx("h1", { children: message }),
			/* @__PURE__ */ jsx("p", { children: details }),
			stack
		]
	});
});
var resume_default$1 = {
	infobox: {
		"github": {
			"name": "github.com/chjon",
			"link": "https://github.com/chjon",
			"icon": "/assets/octocat.svg",
			"iconSize": "16pt",
			"descriptor": "Github logo"
		},
		"email": {
			"name": "chjon@proton.me",
			"link": "mailto:chjon@proton.me",
			"icon": "/assets/mail.svg",
			"iconSize": "16pt",
			"descriptor": "Email icon"
		},
		"phone": {
			"name": "(647) 786 - 9368",
			"icon": "/assets/phone.svg",
			"iconSize": "16pt",
			"descriptor": "Phone icon"
		},
		"website": {
			"name": "jonathanchung.xyz",
			"link": "https://jonathanchung.xyz/",
			"icon": "/assets/web.svg",
			"iconSize": "16pt",
			"descriptor": "Website icon"
		}
	},
	experience: [
		{
			"name": "Software Engineer II",
			"details": "Coalition Inc.",
			"location": "Toronto, ON",
			"date": "2025-07 &#x2011;&nbsp;2026-08",
			"stack": ["python", "postgresql"],
			"content": "Backend server development for an insurance underwriting platform"
		},
		{
			"name": "Software Engineer",
			"details": "Lorica Cybersecurity",
			"location": "Toronto, ON",
			"date": "2023-09 &#x2011;&nbsp;2025-05",
			"stack": [
				"c++17",
				"typescript",
				"python",
				"rust"
			],
			"content": "R&D for applications of Fully Homomorphic Encryption (FHE) and Confidential Computing",
			"content-list": [
				"Designed a new algorithm for performing regex search with FHE, a key feature for the product",
				"Led refactoring of TypeScript/WebAssembly FHE libraries and development of APIs and SDK",
				"Developed a minification tool for the Rego policy language to reduce file sizes by over 90%",
				"Designed a data format and implemented parallel AWS S3 object read/write for encrypted data"
			]
		},
		{
			"name": "Research Assistant",
			"details": "University of Waterloo",
			"location": "Waterloo, ON",
			"date": "2019-09 &#x2011;&nbsp;2023-08",
			"stack": [
				"c++17",
				"c",
				"python"
			],
			"content": "Empirical CS research in automating the Boolean Satisfiability Problem, advised by Dr. Vijay Ganesh",
			"content-list": ["Led the design and implementation of an advanced class of SAT solvers using Extended Resolution", "Advised undergraduate students on the design and implementation of parallelization and machine learning techniques for Satisfaction-Driven Clause Learning SAT solvers"]
		},
		{
			"name": "Teaching Assistant",
			"details": "University of Waterloo",
			"location": "Waterloo, ON",
			"date": "2023-01 &#x2011;&nbsp;2023-08",
			"stack": [
				"rust",
				"cuda",
				"python"
			],
			"content": "Teaching and grading for ECE459 (Programming for Performance) and ECE208 (Discrete Math II)",
			"content-list": ["Assisted in teaching Rust and CUDA basics and created automated grading scripts for ECE459", "Graded assignments and prepared and taught tutorial sessions for 150+ students in ECE208"]
		},
		{
			"name": "CAD Software Architecture Intern",
			"details": "NVIDIA Corp.",
			"location": "Santa Clara, CA",
			"date": "2020-05 &#x2011;&nbsp;2020-08",
			"stack": [
				"c++14",
				"python",
				"perl"
			],
			"content": "Developed features and implemented optimizations in C++ for GPU performance analysis tools",
			"content-list": ["Profiled application using tools such as perf and cachegrind to identify performance bottlenecks", "Parallelized computation and file I/O operations to speed up overall execution time by 2.5x"]
		},
		{
			"name": "Software Development Intern",
			"details": "Darkvision Technologies Inc.",
			"location": "Vancouver, BC",
			"date": "2019-09 &#x2011;&nbsp;2019-12",
			"stack": ["c++14", "directx12"],
			"content": "Developed data visualization tools and features in C++ for an ultrasound-based 3D imaging device",
			"content-list": ["Implemented a tiled HEVC video codec to speed up GPU encoding, increasing throughput by 4x", "Migrated CPU-based visualization tool to DirectX 12, improving performance and maintainability"]
		},
		{
			"name": "Game Programmer Intern",
			"details": "Behaviour Interactive",
			"location": "Montreal, QC",
			"tagline": "Implemented backend features for multiple video games using TypeScript with Node.js",
			"date": "2019-01 &#x2011;&nbsp;2019-04",
			"stack": ["typescript", "python"],
			"content": "Implemented backend features for multiple video games using TypeScript with Node.js",
			"content-list": ["Designed a rich presence system to broadcast and log player activity with Redis and DynamoDB", "Implemented first-party microtransactions for purchasing game items using Nintendo's REST API"]
		}
	],
	education: [{
		"name": "Master of Applied Science",
		"details": "Electrical and Computer Engineering",
		"location": "University of Waterloo",
		"content-list": [
			"CGPA: 95.5%",
			"NSERC Canada Graduate Scholarship - Master's",
			"Dean's Entrance Award",
			"Engineering Excellence Fellowship",
			"President's Graduate Scholarship"
		],
		"date": "2022-09 &#x2011;&nbsp;2023-08"
	}, {
		"name": "Bachelor of Applied Science",
		"details": "Honours Computer Engineering",
		"location": "University of Waterloo",
		"content-list": [
			"CGPA: 91.9%",
			"Dean's Honour's List",
			"NSERC Undergraduate Student Research Award"
		],
		"date": "2017-09 &#x2011;&nbsp;2022-04"
	}],
	volunteering: [{
		"name": "Backend Developer",
		"details": "Wilderness Union",
		"location": "Toronto, ON",
		"date": "2025-04 &#x2011;&nbsp;Present",
		"stack": [
			"typescript",
			"react",
			"postgresql"
		],
		"content": "Developing an HTTP service and Discord bot to facilitate trip administration and coordination"
	}],
	publications: [
		{
			"name": "Improving and Understanding the Power of Satisfaction-Driven Clause Learning",
			"details": "https://jair.org/index.php/jair/article/view/18286/27211",
			"location": "JAIR 2025",
			"date": "2025"
		},
		{
			"name": "Extended Resolution Clause Learning via Dual Implication Points",
			"details": "https://arxiv.org/abs/2406.14190",
			"location": "arXiv 2024",
			"date": "2024"
		},
		{
			"name": "A Reinforcement Learning based Reset Policy for CDCL SAT Solvers",
			"details": "https://arxiv.org/abs/2404.03753",
			"location": "arXiv 2024",
			"date": "2024"
		},
		{
			"name": "Prioritized Unit Propagation and Extended Resolution Techniques for SAT Solvers",
			"details": "https://uwspace.uwaterloo.ca/items/b9fd3615-1cc7-4120-bb9d-883c85fd3c7a",
			"location": "*Master's Thesis*",
			"date": "2023"
		},
		{
			"name": "Learning Shorter Redundant Clauses in SDCL Using MaxSAT",
			"details": "https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.SAT.2023.18",
			"location": "SAT 2023",
			"date": "2023"
		},
		{
			"name": "On the Hierarchical Structure of Practical Boolean Formulas",
			"details": "https://link.springer.com/chapter/10.1007/978-3-030-80223-3_25",
			"location": "SAT 2021",
			"date": "2021"
		}
	],
	projects: [
		{
			"name": "photonic-polycast",
			"link": "https://github.com/chjon/photonic-polycast",
			"icon": {
				"loc": "/assets/octocat.svg",
				"size": "16pt",
				"descriptor": "Github logo"
			},
			"details": "GPU accelerated raytracing",
			"date": "2023",
			"stack": ["cuda", "c++17"]
		},
		{
			"name": "xMaple\\*",
			"link": "https://github.com/chjon/xMapleSAT",
			"icon": {
				"loc": "/assets/octocat.svg",
				"size": "16pt",
				"descriptor": "Github logo"
			},
			"details": "A framework for developing Extended Resolution SAT solvers",
			"date": "2023",
			"stack": ["c++17"]
		},
		{
			"name": "UnitConvertor",
			"link": "https://github.com/chjon/UnitConvertor",
			"icon": {
				"loc": "/assets/octocat.svg",
				"size": "16pt",
				"descriptor": "Github logo"
			},
			"details": "Scientific expression evaluator with automatic unit conversion",
			"date": "2020",
			"stack": ["python"]
		},
		{
			"name": "InfiniteChess",
			"link": "https://github.com/chjon/InfiniteChess",
			"icon": {
				"loc": "/assets/octocat.svg",
				"size": "16pt",
				"descriptor": "Github logo"
			},
			"details": "Data-driven fairy chess on an infinite board",
			"date": "2019",
			"stack": ["c++14", "opengl"]
		}
	],
	skills: [
		{
			"name": "Languages",
			"stack": [
				"C/C++",
				"Python",
				"TypeScript",
				"Rust",
				"CUDA",
				"Java"
			]
		},
		{
			"name": "Web",
			"stack": [
				"HTML",
				"CSS",
				"JavaScript",
				"REST"
			]
		},
		{
			"name": "Tools",
			"stack": [
				"git",
				"Linux",
				"bash",
				"perf",
				"valgrind",
				"gcc",
				"clang"
			]
		},
		{
			"name": "Technologies",
			"stack": [
				"Docker",
				"Kubernetes",
				"S3",
				"DynamoDB",
				"PostgreSQL",
				"gRPC",
				"GoogleTest",
				"ImGui"
			]
		}
	]
};
//#endregion
//#region app/routes/resume.tsx
var resume_exports = /* @__PURE__ */ __exportAll({
	default: () => resume_default,
	meta: () => meta
});
function meta({}) {
	return [{ title: "Resume | Jonathan Chung" }, {
		name: "Jonathan Chung's resume",
		content: "Jonathan Chung's resume"
	}];
}
function InfoBoxEntry(data) {
	return /* @__PURE__ */ jsxs("div", {
		className: "infobox-entry",
		children: [/* @__PURE__ */ jsx("img", {
			className: "infobox-entry-icon",
			width: data.iconSize,
			height: data.iconSize,
			src: data.icon,
			alt: data.descriptor
		}), data.link ? /* @__PURE__ */ jsx("a", {
			href: `${data.link}`,
			children: data.name
		}) : /* @__PURE__ */ jsx("p", { children: data.name })]
	});
}
function ResumeHeader() {
	return /* @__PURE__ */ jsxs("div", {
		id: "header",
		children: [
			/* @__PURE__ */ jsx("h1", { children: "Jonathan Chung" }),
			/* @__PURE__ */ jsxs("div", {
				className: "infobox",
				children: [/* @__PURE__ */ jsx(InfoBoxEntry, { ...resume_default$1.infobox.github }), /* @__PURE__ */ jsx(InfoBoxEntry, { ...resume_default$1.infobox.website })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "infobox",
				children: /* @__PURE__ */ jsx(InfoBoxEntry, { ...resume_default$1.infobox.email })
			})
		]
	});
}
function Markdownify({ data, className }) {
	const [dataHtml, setDataHtml] = useState(data);
	(async () => {
		const text = await marked.parse(data);
		setDataHtml(text);
	})();
	return /* @__PURE__ */ jsx("div", {
		className,
		dangerouslySetInnerHTML: { __html: dataHtml }
	});
}
function ResumeEntryIcon(data) {
	return /* @__PURE__ */ jsx("img", {
		className: "resume-entry-icon",
		width: data.size,
		height: data.size,
		src: data.loc,
		alt: data.descriptor
	});
}
function ResumeExperienceEntry(data) {
	const float = data.float ? /* @__PURE__ */ jsx(Markdownify, {
		data: data.float,
		className: "resume-entry-float"
	}) : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "resume-entry",
		children: [
			float,
			/* @__PURE__ */ jsxs("div", {
				className: "resume-entry-header",
				children: [/* @__PURE__ */ jsx("div", {
					className: "resume-entry-header-left",
					children: data["header-left"]
				}), /* @__PURE__ */ jsx("div", {
					className: "resume-entry-header-right",
					children: data["header-right"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "resume-entry-content",
				children: data.content
			})
		]
	});
}
function TechList({ data }) {
	const className = "language-plaintext highlighter-rouge";
	return data.map((tech) => /* @__PURE__ */ jsx("code", {
		className,
		children: tech
	}, tech));
}
function ResumeExperienceContent() {
	return resume_default$1.experience.map((item) => /* @__PURE__ */ jsx(ResumeExperienceEntry, {
		float: item.date,
		"header-left": /* @__PURE__ */ jsx(Markdownify, { data: `**${item.details}**, *${item.name}*, ${item.location}` }),
		"header-right": /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(TechList, { data: item.stack }) }),
		content: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Markdownify, { data: item.content }), /* @__PURE__ */ jsxs("ul", { children: [
			" ",
			item["content-list"]?.map((bullet, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Markdownify, { data: bullet }) }, `${i}`)),
			" "
		] })] })
	}, item.name));
}
function ResumeEducationContent() {
	return resume_default$1.education.map((item) => /* @__PURE__ */ jsx(ResumeExperienceEntry, {
		float: item.date,
		"header-left": /* @__PURE__ */ jsx(Markdownify, { data: `**${item.name}**, *${item.details}*, ${item.location}` }),
		content: item["content-list"]?.map((bullet) => /* @__PURE__ */ jsx(Markdownify, { data: bullet }, bullet))
	}, item.name));
}
function ResumeVolunteeringContent() {
	return resume_default$1.volunteering.map((item) => /* @__PURE__ */ jsx(ResumeExperienceEntry, {
		float: item.date,
		"header-left": /* @__PURE__ */ jsx(Markdownify, { data: `**${item.details}**, *${item.name}*, ${item.location}` }),
		"header-right": /* @__PURE__ */ jsx(TechList, { data: item.stack }),
		content: /* @__PURE__ */ jsx(Markdownify, { data: item.content })
	}, item.name));
}
function ResumePublicationsContent() {
	return resume_default$1.publications.map((item) => /* @__PURE__ */ jsx(ResumeExperienceEntry, {
		float: item.date,
		"header-left": item.details ? /* @__PURE__ */ jsx("a", {
			href: item.details,
			children: item.name
		}) : /* @__PURE__ */ jsx("p", { children: item.name }),
		"header-right": /* @__PURE__ */ jsx(Markdownify, { data: item.location })
	}, item.name));
}
function ResumeProjectsContent() {
	return resume_default$1.projects.map((item) => /* @__PURE__ */ jsx(ResumeExperienceEntry, {
		float: item.date,
		"header-left": /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ResumeEntryIcon, { ...item.icon }), /* @__PURE__ */ jsx(Markdownify, { data: `[**${item.name}**](${item.link}), *${item.details}*` })] }),
		"header-right": /* @__PURE__ */ jsx(TechList, { data: item.stack })
	}, item.name));
}
function ResumeSkillsContent() {
	return resume_default$1.skills.map((item) => /* @__PURE__ */ jsx(ResumeExperienceEntry, {
		"header-left": /* @__PURE__ */ jsx(Markdownify, { data: `**${item.name}:**` }),
		"header-right": /* @__PURE__ */ jsx("p", { children: item.stack.join(", ") })
	}, item.name));
}
function ResumeSection({ name, content }) {
	return /* @__PURE__ */ jsxs("section", {
		id: name.toLocaleLowerCase(),
		children: [
			/* @__PURE__ */ jsx("div", { className: "vertical-separator-circle" }),
			/* @__PURE__ */ jsx("div", { className: "vertical-separator" }),
			/* @__PURE__ */ jsx("h2", { children: name }),
			/* @__PURE__ */ jsx("div", {
				className: "section-content",
				children: content
			})
		]
	});
}
function ResumeFooter() {
	return /* @__PURE__ */ jsx("div", {
		id: "footer",
		children: /* @__PURE__ */ jsxs("p", { children: ["This resume was built with ", /* @__PURE__ */ jsx(TechList, { data: [
			"html",
			"css",
			"markdown",
			"typescript",
			"react"
		] })] })
	});
}
var resume_default = UNSAFE_withComponentProps(function Resume() {
	return /* @__PURE__ */ jsxs("div", {
		role: "main",
		className: "content-container",
		children: [/* @__PURE__ */ jsx("div", {
			className: "page",
			children: /* @__PURE__ */ jsxs("div", {
				className: "page-content",
				children: [
					/* @__PURE__ */ jsx(ResumeHeader, {}),
					/* @__PURE__ */ jsx(ResumeSection, {
						name: "Experience",
						content: /* @__PURE__ */ jsx(ResumeExperienceContent, {})
					}),
					/* @__PURE__ */ jsx(ResumeSection, {
						name: "Education",
						content: /* @__PURE__ */ jsx(ResumeEducationContent, {})
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "page",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "page-content",
				children: [
					/* @__PURE__ */ jsx(ResumeSection, {
						name: "Volunteering",
						content: /* @__PURE__ */ jsx(ResumeVolunteeringContent, {})
					}),
					/* @__PURE__ */ jsx(ResumeSection, {
						name: "Publications",
						content: /* @__PURE__ */ jsx(ResumePublicationsContent, {})
					}),
					/* @__PURE__ */ jsx(ResumeSection, {
						name: "Projects",
						content: /* @__PURE__ */ jsx(ResumeProjectsContent, {})
					}),
					/* @__PURE__ */ jsx(ResumeSection, {
						name: "Skills",
						content: /* @__PURE__ */ jsx(ResumeSkillsContent, {})
					})
				]
			}), /* @__PURE__ */ jsx(ResumeFooter, {})]
		})]
	});
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-BGOv-JFF.js",
		"imports": ["/assets/jsx-runtime-DZgqFLEa.js", "/assets/errorBoundaries-Ck14I-dz.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-m8b_Qpsq.js",
			"imports": ["/assets/jsx-runtime-DZgqFLEa.js", "/assets/errorBoundaries-Ck14I-dz.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/resume": {
			"id": "routes/resume",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/resume-6GIqc5II.js",
			"imports": ["/assets/jsx-runtime-DZgqFLEa.js"],
			"css": ["/assets/resume-CUYaroNj.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-42eb8478.js",
	"version": "42eb8478",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = false;
var isSpaMode = false;
var prerender = ["/"];
var routeDiscovery = { "mode": "initial" };
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/resume": {
		id: "routes/resume",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: resume_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
