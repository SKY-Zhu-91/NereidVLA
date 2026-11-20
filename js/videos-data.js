window.NEREID_MEDIA = {
  "featured": {
    "id": "navigation-showcase",
    "label": "Navigation showcase",
    "title": "Approach. Maneuver. Continue.",
    "kind": "Simulation + real robot",
    "view": "External + onboard views",
    "playbackLabel": "Labelled source speed-up",
    "duration": 60,
    "src": "assets/videos/real-robot/navigation-sim-and-real.mp4",
    "poster": "assets/video-posters/maneuver-navigation-showcase.webp",
    "instructionLabel": "SIMULATION + REAL-WORLD NAVIGATION",
    "instruction": "Four simulation tasks, followed by four physical-robot tasks in a laboratory pool.",
    "chapters": [
      {
        "start": 0,
        "label": "Obstacle avoidance"
      },
      {
        "start": 12,
        "label": "Target search / approach"
      },
      {
        "start": 24,
        "label": "Pipeline navigation"
      },
      {
        "start": 36,
        "label": "Cave navigation"
      },
      {
        "start": 48,
        "label": "Real robot · Pool"
      }
    ]
  },
  "simulation": [
    {
      "id": "obstacle-avoidance",
      "label": "Obstacle avoidance",
      "title": "Four scenes. Obstacle avoidance.",
      "kind": "Simulation · log replay",
      "view": "External view + synchronized head RGB",
      "playbackLabel": "2.0–2.4× source time",
      "duration": 12,
      "src": "assets/videos/montage-maneuvers/obstacle_avoidance.mp4",
      "poster": "assets/video-posters/maneuver-obstacle_avoidance-quad.webp",
      "instructionLabel": "FOUR COMPLETE MANEUVERS",
      "instruction": "Approach, maneuver, and continue: each continuous excerpt shows the key process without long empty-water cruising.",
      "cases": [
        {
          "label": "Reef boulder · 0089",
          "sceneCode": "0089",
          "src": "assets/videos/montage-maneuvers/scenes/obstacle_avoidance_1.mp4",
          "instruction": "Task: Seabed environment and underwater target survey. Maintain the current heading and move forward, autonomously avoiding obstacles. No deliberate depth change is required; temporary vertical adjustments are allowed for obstacle avoidance and safe seabed clearance."
        },
        {
          "label": "Industrial frame corridor · 0822",
          "sceneCode": "0822",
          "src": "assets/videos/montage-maneuvers/scenes/obstacle_avoidance_2.mp4",
          "instruction": "Task: Fixed-facility inspection. Maintain the current heading and move forward, autonomously avoiding obstacles. No deliberate depth change is required; temporary vertical adjustments are allowed for obstacle avoidance and safe seabed clearance."
        },
        {
          "label": "Pipeline and control-pod obstacles · 0573",
          "sceneCode": "0573",
          "src": "assets/videos/montage-maneuvers/scenes/obstacle_avoidance_3.mp4",
          "instruction": "Task: External pipeline inspection. Maintain the current heading and move forward, autonomously avoiding obstacles. No deliberate depth change is required; temporary vertical adjustments are allowed for obstacle avoidance and safe seabed clearance."
        },
        {
          "label": "Aquaculture cages and service column · 0933",
          "sceneCode": "0933",
          "src": "assets/videos/montage-maneuvers/scenes/obstacle_avoidance_4.mp4",
          "instruction": "Task: Aquaculture cage inspection. Maintain the current heading and move forward, autonomously avoiding obstacles. No deliberate depth change is required; temporary vertical adjustments are allowed for obstacle avoidance and safe seabed clearance."
        }
      ]
    },
    {
      "id": "target-approach",
      "label": "Target search / approach",
      "title": "Four scenes. Target search / approach.",
      "kind": "Simulation · log replay",
      "view": "External view + synchronized head RGB",
      "playbackLabel": "3.3–4.0× source time",
      "duration": 12,
      "src": "assets/videos/montage-maneuvers/target_approach.mp4",
      "poster": "assets/video-posters/maneuver-target_approach-quad.webp",
      "instructionLabel": "FOUR COMPLETE MANEUVERS",
      "instruction": "Approach, maneuver, and continue: each continuous excerpt shows the key process without long empty-water cruising.",
      "cases": [
        {
          "label": "Subsea control skid · 1297",
          "sceneCode": "1297",
          "src": "assets/videos/montage-maneuvers/scenes/target_approach_1.mp4",
          "instruction": "Task: Inspect underwater structures and power facilities. Continue forward toward the subsea control skid, avoiding obstacles along the way. Small lateral and vertical adjustments are allowed. Stop and hover where the equipment is fully visible."
        },
        {
          "label": "Docking station · 1293",
          "sceneCode": "1293",
          "src": "assets/videos/montage-maneuvers/scenes/target_approach_2.mp4",
          "instruction": "Task: Inspect underwater structures and power facilities. Continue forward toward the subsea docking station, avoiding obstacles along the way. Small lateral and vertical adjustments are allowed. Stop and hover where the equipment is fully visible."
        },
        {
          "label": "Tall equipment tower · target_visible_target_03",
          "sceneCode": "Equipment tower",
          "src": "assets/videos/montage-maneuvers/scenes/target_approach_3.mp4",
          "instruction": "Maintain the initial heading and move forward, avoiding obstacles along the way. Find and safely approach the tall subsea equipment tower. The task is complete within 1.5 m of its outer surface while the target remains visible in the forward camera."
        },
        {
          "label": "Eucla photogrammetry wreck · 0384",
          "sceneCode": "0384",
          "src": "assets/videos/montage-maneuvers/scenes/target_approach_4.mp4",
          "instruction": "Task: Seabed environment and underwater target survey. Move forward and to the right toward the Eucla shipwreck, autonomously avoiding obstacles. Small vertical adjustments are allowed. Stop and hover at a safe position where the hull structure is clearly visible."
        }
      ]
    },
    {
      "id": "pipeline",
      "label": "Pipeline navigation",
      "title": "Four scenes. Pipeline navigation.",
      "kind": "Simulation · log replay",
      "view": "External view + synchronized head RGB",
      "playbackLabel": "2.0–2.7× source time",
      "duration": 12,
      "src": "assets/videos/montage-maneuvers/pipe_transit.mp4",
      "poster": "assets/video-posters/maneuver-pipe_transit-quad.webp",
      "instructionLabel": "FOUR COMPLETE MANEUVERS",
      "instruction": "Approach, maneuver, and continue: each continuous excerpt shows the key process without long empty-water cruising.",
      "cases": [
        {
          "label": "Elbow with floor-mounted obstacles · 0873",
          "sceneCode": "0873",
          "src": "assets/videos/montage-maneuvers/scenes/pipe_transit_1.mp4",
          "instruction": "Task: Obstacle avoidance inside a large flooded pipe. Follow the visible passage ahead, turning left or right with the bends. Avoid internal obstacles, keep a safe distance from the walls, and approach the exit. Stop if the turn is not visible; do not turn blindly."
        },
        {
          "label": "Broad curved pipe with floor obstructions · 0862",
          "sceneCode": "0862",
          "src": "assets/videos/montage-maneuvers/scenes/pipe_transit_2.mp4",
          "instruction": "Task: Obstacle avoidance inside a large flooded pipe. Follow the visible passage ahead, turning left or right with the bends. Avoid internal obstacles, keep a safe distance from the walls, and approach the exit. Stop if the turn is not visible; do not turn blindly."
        },
        {
          "label": "Coated S-bend with floor obstruction · 0898",
          "sceneCode": "0898",
          "src": "assets/videos/montage-maneuvers/scenes/pipe_transit_3.mp4",
          "instruction": "Task: Obstacle avoidance inside a large flooded pipe. Follow the visible passage ahead, turning left or right with the bends. Avoid internal obstacles, keep a safe distance from the walls, and approach the exit. Stop if the turn is not visible; do not turn blindly."
        },
        {
          "label": "S-bend with side intrusion · 0867",
          "sceneCode": "0867",
          "src": "assets/videos/montage-maneuvers/scenes/pipe_transit_4.mp4",
          "instruction": "Task: Obstacle avoidance inside a large flooded pipe. Follow the visible passage ahead, turning left or right with the bends. Avoid internal obstacles, keep a safe distance from the walls, and approach the exit. Stop if the turn is not visible; do not turn blindly."
        }
      ]
    },
    {
      "id": "cave",
      "label": "Cave navigation",
      "title": "Four scenes. Cave navigation.",
      "kind": "Simulation · log replay",
      "view": "External view + synchronized head RGB",
      "playbackLabel": "2.4–3.3× source time",
      "duration": 12,
      "src": "assets/videos/montage-maneuvers/cave_transit.mp4",
      "poster": "assets/video-posters/maneuver-cave_transit-quad.webp",
      "instructionLabel": "FOUR COMPLETE MANEUVERS",
      "instruction": "Approach, maneuver, and continue: each continuous excerpt shows the key process without long empty-water cruising.",
      "cases": [
        {
          "label": "Rock-obstructed cave corridor · 0993",
          "sceneCode": "0993",
          "src": "assets/videos/montage-maneuvers/scenes/cave_transit_1.mp4",
          "instruction": "Task: Underwater cave navigation. Move forward along the visible cave passage, autonomously avoiding walls, rocks, and protrusions. Maintain safe clearance and stop after reaching the designated endpoint region inside the cave."
        },
        {
          "label": "High-vault cave with hanging projections · 1120",
          "sceneCode": "1120",
          "src": "assets/videos/montage-maneuvers/scenes/cave_transit_2.mp4",
          "instruction": "Task: Underwater cave navigation. Move forward along the visible cave passage, autonomously avoiding walls, rocks, and protrusions. Maintain safe clearance and stop after reaching the designated endpoint region inside the cave."
        },
        {
          "label": "Low-vault cave with edge obstructions · 1126",
          "sceneCode": "1126",
          "src": "assets/videos/montage-maneuvers/scenes/cave_transit_3.mp4",
          "instruction": "Task: Underwater cave navigation. Move forward along the visible cave passage, autonomously avoiding walls, rocks, and protrusions. Maintain safe clearance and stop after reaching the designated endpoint region inside the cave."
        },
        {
          "label": "Cave chamber with floor boulders · 1233",
          "sceneCode": "1233",
          "src": "assets/videos/montage-maneuvers/scenes/cave_transit_4.mp4",
          "instruction": "Task: Underwater cave navigation. Move forward along the visible cave passage, autonomously avoiding walls, rocks, and protrusions. Maintain safe clearance and stop after reaching the designated endpoint region inside the cave."
        }
      ]
    }
  ],
  "realWorld": [
    {
      "id": "real-target",
      "label": "Target approach",
      "title": "Target approach",
      "kind": "Real robot · laboratory pool",
      "view": "External + onboard views",
      "playbackLabel": "1.23× source time",
      "duration": 12,
      "src": "assets/videos/real-robot/real-target.mp4",
      "poster": "assets/video-posters/real-target.webp",
      "instructionLabel": "TASK INSTRUCTION",
      "instruction": "Approach the white square block ahead."
    },
    {
      "id": "real-obstacle",
      "label": "Obstacle avoidance",
      "title": "Obstacle avoidance",
      "kind": "Real robot · laboratory pool",
      "view": "External + onboard views",
      "playbackLabel": "1.84× source time",
      "duration": 12,
      "src": "assets/videos/real-robot/real-obstacle.mp4",
      "poster": "assets/video-posters/real-obstacle.webp",
      "instructionLabel": "TASK INSTRUCTION",
      "instruction": "Move forward while avoiding obstacles along the way."
    },
    {
      "id": "real-obstacle-target",
      "label": "Goal approach with obstacles",
      "title": "Goal approach with obstacles",
      "kind": "Real robot · laboratory pool",
      "view": "External + onboard views",
      "playbackLabel": "1.91× source time",
      "duration": 12,
      "src": "assets/videos/real-robot/real-obstacle-target.mp4",
      "poster": "assets/video-posters/real-obstacle-target.webp",
      "instructionLabel": "TASK INSTRUCTION",
      "instruction": "Approach the white square block ahead while avoiding the obstacles along the way."
    },
    {
      "id": "real-passage",
      "label": "Narrow-passage navigation",
      "title": "Narrow-passage navigation",
      "kind": "Real robot · laboratory pool",
      "view": "External + onboard views",
      "playbackLabel": "1.53× source time",
      "duration": 12,
      "src": "assets/videos/real-robot/real-passage.mp4",
      "poster": "assets/video-posters/real-passage.webp",
      "instructionLabel": "TASK INSTRUCTION",
      "instruction": "Follow the narrow passage toward the exit, avoid obstacles and walls, and stop if the path ahead is no longer visible."
    }
  ]
};
