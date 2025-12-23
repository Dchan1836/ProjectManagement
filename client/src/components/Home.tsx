import React from 'react';
// import SplitPane from 'react-split-pane';
import { MyGantt } from "./MyGantt.tsx";
import { MyKanban } from './MyKanban.tsx';

export const Home: React.FC = () => {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
      <section >
        <h2>Welcome</h2>
        <p>
          Organize tasks, plan timelines, and track progress with an integrated Gantt chart.
        </p>
        {/* <MyKanban /> */}
      </section>
        {/* <MyGantt /> */}
      {/* <MyKanban /> */}
    </main>
  );
};


