import {useEffect, useState, useCallback ,useRef, useMemo} from 'react'
import * as d3 from 'd3'
import { useHistory} from 'react-router'

const radialPoint = (x, y) => {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

const genColors = [
        '#000','#7d1e01', '#2c3e50',
        '#80016e','#673ab7',
        '#ff9800','#795548','#142796',
        '#61b301','#19a0b1','#a0342c',
        '#CEE397','#F5A25D','#625261',
        '#87556F','#E5EDB7','#231E23',
        '#6F0000','#FFF0F5','#FFEBD9',
        '#BEEBE9','#B0A160','#E4F9FF',
    ]



const Tree = ({familyData,isProfile, isPoint}) => {
    const wrapperRef = useRef(null)
    const history = useHistory()
    const [triggerTree, setTriggerTree] = useState(false)
    
    const familyTree = useCallback(() => {
            if(wrapperRef.current){
                wrapperRef.current.innerHTML = '';
            const margin = {top: 140, right: 0, bottom: 20, left: 0}
            wrapperRef.current.width = wrapperRef.current.getBoundingClientRect().width
            wrapperRef.current.height = wrapperRef.current.getBoundingClientRect().height
            const innerHeight = 2000 - margin.top - margin.bottom;
            const svg = d3.select(wrapperRef.current)
                        .append('svg')
                        .attr('width', 4000)
                        .attr('height', 2200)
                        .attr('encoding', 'UTF-8')
                        
            const width = +svg.attr("width")
            const height = +svg.attr("height")
            const g = svg.append("g")
            .attr("transform", `translate(${(width/2+ 40)},${(height - 30)})`);
            
            const dataStructure = d3.stratify().id(d => d._id).parentId(d => d.parentId)(familyData)
            const treeLayout = d3.tree().size([(1 * Math.PI), innerHeight])
            const root = treeLayout(dataStructure)
            
            
            g.selectAll(".link")
                .data(root.links())
                .enter().append("path")
                .attr('fill', 'none')
                .attr('stroke', '#555')
                .attr('stroke-opacity', '0.4')
                .attr('stroke-width', (d) => {
                    if(d.target.depth <= 9){
                        return 8 - d.target.depth
                    } else {
                        return 1
                    }
                })
                .attr("d", d3.linkRadial()
                .angle(d => d.x-Math.PI/2)
                .radius(d => d.y + 10))
                .attr('id',  d => 'link_' + d.target.data._id)
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
        
            const node = g.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", d => d.children ? " node--internal" : " node--leaf")
                .attr('transform', d =>  "translate(" + radialPoint(d.x-Math.PI/2, (d.y+10)) + ")");
                node.append("circle")
                .attr("r", d => !d.children && d.depth === 1 ? 3 : 7 - (d.depth))
                .style("stroke","white")
                 .style("fill", d => {   
                    if(d.children){
                        return genColors[d.depth]
                    } else {
                        return '#04a21a'
                    }
                })
                .attr('opacity', 0)
                .transition()
                .duration(1500)
                .delay(d => d.depth * 500)
                .attr('opacity', 1)
            
            node.append("image")
                .attr("xlink:href", d => !d.children ? "/image/leaf.png":"")
                .attr('x', d => d.x > Math.PI/2 ? '-5px': '-10px')
                .attr('y', d => !d.children && d.depth === 1 ? '-55px':"-90px")
                .attr("transform", d => `rotate(${(d.x > Math.PI/2 ? d.x-Math.PI/2  : d.x-Math.PI/2 ) * 180 / Math.PI})`)
                .attr('width', d => d.depth === 1 ? '1rem' : '1.5rem')
                .attr('opacity', 0)
                .transition()
                .duration(1500)
                .delay(d => d.depth * 500)
                .attr('opacity', 1)
                
            node.append("text")
                .attr("dy","0.32em")
                .attr('y', (d) => d.depth === 1 ? -1: 2)
                .attr("x", (d) => {
                    if(!d.children){
                        if(d.depth === 1){
                            return 20
                        }
                        if(d.x > Math.PI/2){
                            return 30
                        }else {
                            return -40
                        }
                    }else {
                        return -80
                    }
                })
                // eslint-disable-next-line
                .attr("text-anchor", d => d.x > Math.PI/2 === !d.children ? "middle" : "end")
                .attr("transform", d => d.depth > 1 ? `rotate(${(d.x > Math.PI/2 ? d.x-Math.PI/2 - Math.PI / 2 : d.x-Math.PI/2 + Math.PI / 2) * 180 / Math.PI})` : '')
                .style("font-size", d => {
                    return d.children  ?  2 - (d.depth * 2) /10 + 'em' 
                    :d.depth === 1 ?'0.37em' : d.depth === 2 ? '0.6em' :'0.85em'
                })
                .text(d => d.data.firstName)
                .attr('id',  d => 'name_' + d.data._id)
                .style('cursor', 'pointer')
                .style(' z-index', '9999999')
                .attr('fill', (d) =>{
                    if(d.children){
                        return genColors[d.depth]
                    } else {
                        return '#04a21a'
                    }
                })
                .on('mouseover', (e, d) => {
                    if(isPoint){
                        d3.selectAll('path').style('stroke', '#2c3e50').style('opacity', 0.2)
                        d3.selectAll('text').style('fill', '#2c3e50').style('opacity', 0.2)
                        d3.selectAll('circle').style('fill', '#2c3e50').style('opacity', 0.2)
                        d3.selectAll('image').style('opacity', '0.1')
                        while(d){
                            if(!d.data.parentId ) {
                                d3.select(`#name_${d.data._id}`).style('fill','#000').style('opacity','1')
                            }
                            if(d.data.parentId !== null){
                                d3.select(`#link_${d.data._id}`).style('stroke','#b70202').style('opacity','1')
                                d3.select(`#name_${d.data._id}`).attr('fill','#000').style('opacity','1')
                                .style('font-size', '3rem')
                                .transition()
                                .duration(500)
                                .style('font-size', '5rem');
                            }
                            d = d.parent
                        }
                    }    
                })
                .on('mouseout', () => {
                    if(isPoint){
                        d3.selectAll('path').style('stroke', '#555').style('opacity','0.4')
                    d3.selectAll('text').style('fill', (d) => {
                        if(d.children){
                            return genColors[d.depth]
                        } else {
                            return '#04a21a'
                        }
                    }).style('font-size', d => {
                        return d.children  ?  2 - (d.depth * 2) /10 + 'em' 
                        :d.depth === 1 ?'0.37em' : d.depth === 2 ? '0.6em' :'0.85em'
                    }).style('opacity','1')
                    d3.selectAll('image').style('opacity', '1')
                    d3.selectAll('circle').style('fill', (d) => {
                        if(d.children){
                            return genColors[d.depth]
                        } else {
                            return '#04a21a'
                        }
                    }).style('opacity','1')
                    }      
            })
            .on('click', (e, d) => {
                if(!isProfile){
                    history.push(`/info/${d.data._id}`)
                } 
            })
            .attr('opacity', 0)
                .transition()
                .duration(1500)
                .delay(d => d.depth * 600)
                .attr('opacity', 1)
            
           
            }
        },
        [familyData, isPoint, isProfile, history],
    )
    useMemo(familyTree,[familyTree, triggerTree])  
  
 useEffect(() => {
    setTriggerTree(true)
  },[])
   
  return <div className="tree__wrapper" ref={wrapperRef}></div>
    
}

export default Tree
