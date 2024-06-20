import React, { useState } from 'react';
import { fetchVideosFromFirebase, fetchTopicsAndSubtopics } from '../../../firebase/firebaseReadWrite';
import { deleteAndArchiveVideo } from '../../../firebase/firebaseVideoArchive';
import SubtopicExpandedBox from './Components/SubtopicExpandedBox';

function RemoveVideo() {
	const videoValue = fetchVideosFromFirebase();
	const topicsAndSubtopics = fetchTopicsAndSubtopics();
	const [expandedTopics, setExpandedTopics] = useState([]);

	const handleDeleteVideo = async (videoKey) => {
		const success = await deleteAndArchiveVideo(videoKey);
		if (success) {
			console.log('Video deleted successfully');
		} else {
			console.log('Video deleted failed');
		}
	};

	const displayedVideos = videoValue.filter((video) => {
		if (expandedTopics.length === 0) {
			return true;
		}

		const topic = topicsAndSubtopics.find(([t]) => t === video.category);
		return topic && expandedTopics.includes(video.category) && topic[1].includes(video.subtopic);
	});

	const toggleTopic = (topic) => {
		setExpandedTopics((prevTopics) =>
			prevTopics.includes(topic) ? prevTopics.filter((t) => t !== topic) : [...prevTopics, topic],
		);
	};

	if (videoValue && topicsAndSubtopics) {
		return (
			<div className="flex flex-col items-center min-h-screen">
				<h1 className="text-3xl font-bold my-12">Remove Videos</h1>

				<SubtopicExpandedBox
					topicsAndSubtopics={topicsAndSubtopics}
					toggleTopic={toggleTopic}
					expandedTopics={expandedTopics}
				/>

				<div className="w-full max-w-6xl mt-8">
					<table className="w-full table-auto border-collapse">
						<thead>
							<tr className="	bg-primaryColor text-white">
								<th className="px-4 py-2">Title</th>
								<th className="px-4 py-2">Category</th>
								<th className="px-4 py-2">Subtopic</th>
								<th className="px-4 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{displayedVideos.map((video) => (
								<tr key={video.key} className="border-t border-gray-200 text-center">
									<td className="px-4 py-2">{video.title}</td>
									<td className="px-4 py-2">{video.category}</td>
									<td className="px-4 py-2">{video.subtopic}</td>
									<td className="px-4 py-2">
										<button
											type="button"
											className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
											onClick={() => handleDeleteVideo(video.key)}
										>
											Delete & Archive
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default RemoveVideo;
