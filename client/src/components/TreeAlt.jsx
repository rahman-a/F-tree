import {useEffect, useRef} from 'react'
import {
    select,
    hierarchy, 
    stratify, 
    tree,
    linkVertical,
    selectAll,
} from 'd3'
import { useHistory} from 'react-router'
import useResizeObserver from './useResizeObserver'

const Tree = ({familyData,isProfile}) => {
    const wrapperRef = useRef()
    const dimension = useResizeObserver(wrapperRef)
    const history = useHistory()
    const genColors = [
        '#000','#7d1e01', '#2c3e50',
        '#80016e','#673ab7','#04a21a',
        '#ff9800','#795548','#142796',
        '#61b301','#19a0b1','#a0342c',
        '#CEE397','#F5A25D','#625261',
        '#87556F','#E5EDB7','#231E23',
        '#6F0000','#FFF0F5','#FFEBD9',
        '#BEEBE9','#B0A160','#E4F9FF',
    ]
    useEffect(() => {
        if(!dimension) return;
        console.log(dimension);
        wrapperRef.current.innerHTML = '';
        const margin = {top: 140, right: 10, bottom: 140, left: 10}
        const width = 4000 - margin.left - margin.right;
        const height = 2000 - margin.top - margin.bottom;
        const dataStructure = stratify().id(id => id._id).parentId(id => id.parentId)(familyData)
        const root = hierarchy(dataStructure)
        const rootTree = tree().size([(width), (height)])
        rootTree(root)
        const linkGenerator = linkVertical().x(node => node.x).y(node => node.y)
        
        const svg = select(wrapperRef.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .style('fill', 'transparent')
                    .attr("transform", `translate(${margin.left},${margin.top})`);
        
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "border");
        
        svg.selectAll('.node')
            .data(root.descendants())
            .join('circle')
            .attr('r', 12)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', (d) => {
               return genColors[d.depth]
            })
            .style('stroke', '#cacaca')
            .style('stroke-width', '6')
            .attr('opacity', 0)
            .transition()
            .duration(1500)
            .delay(d => d.data.depth * 500)
            .attr('opacity', 1)
        
        
        
        svg.selectAll('.leaf')
            .data(root.descendants())
            .join('image')
            .attr('xlink:href','/image/leaf.webp')
            .attr('width', '8rem')
            .style('display', (d) => {
                if(!d.children) return 'inline'
                else return 'none'
            })
            .attr('x', d => d.x - 50)
            .attr('y', d => d.y + 65)
            .attr('transform' , (d) => {
                return `rotate(90, ${d.x - 2}, ${d.y + 90})`
            })
            .attr('opacity', 0)
            .transition()
            .duration(1500)
            .delay(d => d.data.depth * 500)
            .attr('opacity', 1)
        
        svg.selectAll('.link')
            .data(root.links())
            .join('path')
            .attr('fill', 'none')
            .attr('d', linkGenerator)
            .attr('stroke', '#555')
            .attr('stroke-width', (d) => {
                if(d.target.data.depth <= 9){
                    return 10 - d.target.data.depth
                } else {
                    return 1
                }
            })
            .attr('opacity', '0.5')
            .attr('id',  d => 'link_' + d.target.data.data._id)
            .attr('stroke-dasharray', function(){
                const length = this.getTotalLength()
                return `${length} ${length}`
            })
            .attr('stroke-dashoffset', function(){
                const length = this.getTotalLength()
                return length
            })
            .transition()
            .duration(1500)
            .delay(d => d.source.depth * 500)
            .attr('stroke-dashoffset', 0)
            
        svg.selectAll('.name')
            .data(root.descendants())
            .join('text')
            .text(d => d.data.data.firstName)
            .attr('x', d => d.x + 15)
            .attr('y', d => d.y + 15)
            .attr('dy', '0.71em')
            .attr('id',  d => 'name_' + d.data.data._id)
            .style('cursor', 'pointer')
            .style('font-size', '3rem')
            .style(' z-index', '9999999')
            .attr('fill', (d) =>{
                return genColors[d.depth]
            })
            .on('mouseover', (e, d) => {
                selectAll('path').style('stroke', '#2c3e50').style('opacity', 0.2)
                selectAll('text').style('fill', '#2c3e50').style('opacity', 0.2)
                selectAll('circle').style('fill', '#2c3e50').style('opacity', 0.2)
                selectAll('image').style('opacity', '0.1')
                while(d){
                    if(!d.data.parentId ) {
                        select(`#name_${d.data.data._id}`).style('fill','#000').style('opacity','.8')
                    }
                    if(d.data.parentId !== null){
                        select(`#link_${d.data.data._id}`).style('stroke','#b70202').style('opacity','0.5')
                        select(`#name_${d.data.data._id}`).attr('fill','#000').style('opacity','0.8')
                        .style('font-size', '3rem')
                        .transition()
                        .duration(500)
                        .style('font-size', '5rem');
                    }
                    d = d.parent
                }
            })
            .on('mouseout', () => {
                    selectAll('path').style('stroke', '#555').style('opacity','0.5')
                    selectAll('text').style('fill', (d) => {
                        return genColors[d.depth]
                    }).style('font-size', '3rem').style('opacity','1')
                    selectAll('image').style('opacity', '1').style('opacity','1')
                    selectAll('circle').style('fill', (d) => {
                        return genColors[d.depth]
                    }).style('opacity','1')
            })
            .on('click', (e, d) => {
                if(!isProfile){
                    history.push(`/info/${d.data.data._id}`)
                } 
            })
            .attr('opacity', 0)
            .transition()
            .duration(1500)
            .delay(d => d.data.depth * 500)
            .attr('opacity', 1)
   },[familyData, dimension, history, genColors, isProfile])
    
   return (
    <div ref={wrapperRef} className='tree__wrapper'></div>
   
    )
}

export default Tree
