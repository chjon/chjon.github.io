import { marked } from "marked";
import type { Route } from "./+types/resume";
import "../css/resume.css";
import resume_data from "../data/resume.json";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Resume | Jonathan Chung",
    },
    {
      name: "Jonathan Chung's resume",
      content: "Jonathan Chung's resume",
    },
  ];
}

type InfoBoxEntryParams = {
  name: string;
  link?: string;
  iconSize: string;
  icon: string;
  descriptor: string;
};

function InfoBoxEntry(data: InfoBoxEntryParams) {
  return (
    <div className="infobox-entry">
      <img
        className="infobox-entry-icon"
        width={data.iconSize}
        height={data.iconSize}
        src={data.icon}
        alt={data.descriptor}
      />
      {data.link ? (
        <a href={`${data.link}`}>{data.name}</a>
      ) : (
        <p>{data.name}</p>
      )}
    </div>
  );
}

function ResumeHeader() {
  return (
    <div id="header">
      <h1>Jonathan Chung</h1>
      <div className="infobox">
        <InfoBoxEntry {...resume_data.infobox.github} />
        <InfoBoxEntry {...resume_data.infobox.website} />
      </div>
      <div className="infobox">
        <InfoBoxEntry {...resume_data.infobox.email} />
        {/* <InfoBoxEntry {...resume_data.infobox.phone} /> */}
      </div>
    </div>
  );
}

function Markdownify({
  data,
  className,
}: {
  data: string;
  className?: string;
}) {
  const [dataHtml, setDataHtml] = useState(data);
  (async () => {
    const text = await marked.parse(data);
    setDataHtml(text);
  })();
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: dataHtml }} />
  );
}

function ResumeEntryIcon(data: {
  size: string;
  loc: string;
  descriptor: string;
}) {
  return (
    <img
      className="resume-entry-icon"
      width={data.size}
      height={data.size}
      src={data.loc}
      alt={data.descriptor}
    />
  );
}

function ResumeExperienceEntry(data: {
  float?: string;
  content?: React.JSX.Element | Array<React.JSX.Element>;
  "header-left"?: React.JSX.Element | Array<React.JSX.Element>;
  "header-right"?: React.JSX.Element | Array<React.JSX.Element>;
}) {
  const float = data.float ? (
    <Markdownify data={data.float} className="resume-entry-float" />
  ) : null;
  return (
    <div className="resume-entry">
      {float}
      <div className="resume-entry-header">
        <div className="resume-entry-header-left">{data["header-left"]}</div>
        <div className="resume-entry-header-right">{data["header-right"]}</div>
      </div>
      <div className="resume-entry-content">{data.content}</div>
    </div>
  );
}

function TechList({ data }: { data: Array<string> }) {
  const className = "language-plaintext highlighter-rouge";
  return data.map((tech) => (
    <code key={tech} className={className}>
      {tech}
    </code>
  ));
}

function ResumeExperienceContent() {
  return resume_data.experience.map((item) => (
    <ResumeExperienceEntry
      key={item.name}
      float={item.date}
      header-left={
        <Markdownify
          data={`**${item.details}**, *${item.name}*, ${item.location}`}
        />
      }
      header-right={
        <p>
          <TechList data={item.stack} />
        </p>
      }
      content={
        <>
          <Markdownify data={item.content} />
          <ul>
            {" "}
            {item["content-list"]?.map((bullet, i) => (
              <li key={`${i}`}>
                <Markdownify data={bullet} />
              </li>
            ))}{" "}
          </ul>
        </>
      }
    />
  ));
}

function ResumeEducationContent() {
  return resume_data.education.map((item) => (
    <ResumeExperienceEntry
      key={item.name}
      float={item.date}
      header-left={
        <Markdownify
          data={`**${item.name}**, *${item.details}*, ${item.location}`}
        />
      }
      content={item["content-list"]?.map((bullet) => (
        <Markdownify key={bullet} data={bullet} />
      ))}
    />
  ));
}

function ResumeVolunteeringContent() {
  return resume_data.volunteering.map((item) => (
    <ResumeExperienceEntry
      key={item.name}
      float={item.date}
      header-left={
        <Markdownify
          data={`**${item.details}**, *${item.name}*, ${item.location}`}
        />
      }
      header-right={<TechList data={item.stack} />}
      content={<Markdownify data={item.content} />}
    />
  ));
}

function ResumePublicationsContent() {
  return resume_data.publications.map((item) => (
    <ResumeExperienceEntry
      key={item.name}
      float={item.date}
      header-left={
        item.details ? (
          <a href={item.details}>{item.name}</a>
        ) : (
          <p>{item.name}</p>
        )
      }
      header-right={<Markdownify data={item.location} />}
    />
  ));
}

function ResumeProjectsContent() {
  return resume_data.projects.map((item) => (
    <ResumeExperienceEntry
      key={item.name}
      float={item.date}
      header-left={
        <>
          <ResumeEntryIcon {...item.icon} />
          <Markdownify
            data={`[**${item.name}**](${item.link}), *${item.details}*`}
          />
        </>
      }
      header-right={<TechList data={item.stack} />}
    />
  ));
}

function ResumeSkillsContent() {
  return resume_data.skills.map((item) => (
    <ResumeExperienceEntry
      key={item.name}
      header-left={<Markdownify data={`**${item.name}:**`} />}
      header-right={<p>{item.stack.join(", ")}</p>}
    />
  ));
}

function ResumeSection({
  name,
  content,
}: {
  name: string;
  content: React.JSX.Element;
}) {
  return (
    <section id={name.toLocaleLowerCase()}>
      <div className="vertical-separator-circle" />
      <div className="vertical-separator" />
      <h2>{name}</h2>
      <div className="section-content">{content}</div>
    </section>
  );
}

function ResumeFooter() {
  const stack = ["html", "css", "markdown", "typescript", "react"];
  return (
    <div id="footer">
      <p>This resume was built with {<TechList data={stack} />}</p>
    </div>
  );
}

export default function Resume() {
  return (
    <div role="main" className="content-container">
      <div className="page">
        <div className="page-content">
          <ResumeHeader />
          <ResumeSection
            name="Experience"
            content={<ResumeExperienceContent />}
          />
          <ResumeSection
            name="Education"
            content={<ResumeEducationContent />}
          />
        </div>
      </div>
      <div className="page">
        <div className="page-content">
          <ResumeSection
            name="Volunteering"
            content={<ResumeVolunteeringContent />}
          />
          <ResumeSection
            name="Publications"
            content={<ResumePublicationsContent />}
          />
          <ResumeSection name="Projects" content={<ResumeProjectsContent />} />
          <ResumeSection name="Skills" content={<ResumeSkillsContent />} />
        </div>
        <ResumeFooter />
      </div>
    </div>
  );
}
