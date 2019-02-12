import React from 'react';
import axios from 'axios';

import '../styles/application.scss';

class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redditResults: null,
            search: '',
            filteredResults: null
        };
    }

    /**
     * This method retrieves a reddit science data feed and sets the data into state as an array of:
     *
     * {
     *     url: "https:www.reddit.com/s/some-url",
     *     thumbnail: "https://b.thumbs.redditmedia.com/YHdl2LLiNLu_h2XgBsl2XtXcvj_YE1mJRnBlt7aizeo.jpg",
     *     title: "CDC study finds e-cigarettes responsible for dramatic increase in tobacco use among middle and high school students erasing the decline in teen tobacco product use from previous years."
     * }
     *
     */
    componentDidMount() {
        const component = this;
        axios.get('https://www.reddit.com/r/science.json').then(function (response) {
            const redditResults = response.data.data.children.map(node => {
                const data = node.data;
                return {
                    url: `https://www.reddit.com${data.permalink}`,
                    thumbnail: data.thumbnail,
                    title: data.title,
                };
            });
            component.setState({ redditResults: redditResults });
        }).catch(function (error) {
            console.log(error);
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.search !== prevState.search) {
            this.renderSearch()
        }
    }
    render() {
        const { redditResults, filteredResults } = this.state;
        return (
            <section>
                <div className="search">
                    <input type="text" name="search" id="search"
                        placeholder="Search reddit..."
                        onChange={(e) => this.setState({ search: e.target.value })}
                    />
                </div>
                {filteredResults && redditResults && redditResults.length !== 0 && (
                    <ul>
                        {filteredResults.map(({ thumbnail, title, url }, index) => (
                            <li key={index}>
                                <a target="_blank" href={url}>
                                    <strong>{title}</strong>
                                    <img src={thumbnail} alt={title} />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {redditResults && !filteredResults && (
                    <ul>
                        {redditResults.map(({ thumbnail, title, url }, index) => (
                            <li key={index}>
                                <a target="_blank" href={url}>
                                    <strong>{title}</strong>
                                    <img src={thumbnail} alt={title} />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {!redditResults && (
                    <h4>Loading posts...</h4>
                )}
            </section>
        );
    }
    renderSearch = () => {
        const { search, filteredResults, redditResults } = this.state
        
        const filtered = redditResults.filter(({ title }) => {
            const lowerTitle = title.toLowerCase()
            const lowerSearch = search.toLowerCase()
            return lowerTitle.includes(lowerSearch)
        })
        this.setState({filteredResults: filtered})
    }
}

export default IndexPage;
